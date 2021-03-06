import {
  RSAKey
} from '@/utils/rsa/rsa.js';
import {
  b64tohex,
  hex2b64
} from "@/utils/rsa/base64.js";

const app = getApp()
let isLogin = false
/**
 * 获取密码RSA加密PublicKey
 */
export function getPublicKey() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: app.globalData.server.edu + "/jwglxt/xtgl/login_getPublicKey.html?time=" + new Date().getTime(),
      method: "GET",
      withCredentials: true,
      cookie: true
    }).then(data => {
      var rsaKey = new RSAKey();
      rsaKey.setPublic(b64tohex(data.data.modulus), b64tohex(data.data.exponent))
      resolve(rsaKey)
    }).catch(err => {
      reject(err)
    })
  })
}
/**
 * 登录
 */
export function login() {
  var sid = uni.getStorageSync('sid')
  var edupw = uni.getStorageSync('edupw')
  if (sid == null || sid == '' || edupw == null || edupw == '') {
    return new Promise((resolve, reject) => {
      reject('未绑定个人信息')
    })
  }
  return new Promise((resolve, reject) => {
    getPublicKey()
      .then(rsaKey => {
        var enPassword = hex2b64(rsaKey.encrypt(edupw));
        uni.request({
          url: app.globalData.server.edu + '/jwglxt/xtgl/login_slogin.html',
          method: "POST",
          withCredentials: true,
          cookie: true,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            yhm: sid,
            mm: enPassword
          }
        }).then(res => {
          isLogin = true
          resolve()
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
  })
}
/**
 * 获取课表
 */
export function getCourses() {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: 'courses'
    }).then(res => {
      if (res.data !== null && res.data !== '') {
        console.log("从缓存中成功读取到了courses")
        resolve(res.data)
      } else {
        throw '缓存数据错误'
      }
    }).catch(err => {
      login()
        .then(() => {
          uni.request({
            url: app.globalData.server.edu +
              "/jwglxt/kbcx/xskbcx_cxXsKb.html?doType=query&gnmkdm=N2151",
            method: "POST",
            withCredentials: true,
            cookie: true,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              xnm: '2020',
              xqm: '12'
            }
          }).then(data => {
            if (data.data != null && data.data != '') {
              uni.setStorageSync("courses", data.data)
            }
            resolve(data.data)
          }).catch(err => {
            reject(err)
          })
        }).catch(err => {
          reject(err)
        })
    })
  })
}
/**
 * 获取成绩
 */
export function getScores() {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: 'scores'
    }).then(res => {
      if (res.data !== null && res.data !== '') {
        console.log("从缓存中成功读取到了scores")
        resolve(res.data)
      } else {
        throw '缓存数据错误'
      }
    }).catch(err => {
      login()
        .then(() => {
          uni.request({
            url: app.globalData.server.edu +
              "/jwglxt/cjcx/cjcx_cxDgXscj.html?doType=query&gnmkdm=N305005",
            method: "POST",
            withCredentials: true,
            cookie: true,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              xnm: '',
              xqm: '',
              _search: false,
              nd: new Date().getTime(),
              time: 1,
              "queryModel.showCount": 100,
              "queryModel.currentPage": 1,
              "queryModel.sortName": '',
              "queryModel.sortOrder": 'asc'
            }
          }).then(data => {
            if (data.data.items.length > 0) {
              uni.setStorageSync("scores", data.data.items)
            }
            resolve(data.data.items)
          }).catch(err => {
            reject(err)
          })
        }).catch(err => {
          reject(err)
        })
    })
  })
}

/**
 * 获取考试
 */
export function getExams() {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: 'exams'
    }).then(res => {
      if (res.data !== null && res.data !== '') {
        console.log("从缓存中成功读取到了exams")
        resolve(res.data)
      } else {
        throw '缓存数据错误'
      }
    }).catch(err => {
      login()
        .then(() => {
          uni.request({
            url: app.globalData.server.edu +
              "/jwglxt/kwgl/kscx_cxXsksxxIndex.html?doType=query&gnmkdm=N358105",
            method: "POST",
            withCredentials: true,
            cookie: true,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              xnm: '2020',
              xqm: '12',
              _search: false,
              ksmcdmb_id: '',
              kch: '',
              kc: '',
              ksrq: '',
              nd: new Date().getTime(),
              time: 1,
              "queryModel.showCount": 100,
              "queryModel.currentPage": 1,
              "queryModel.sortName": '',
              "queryModel.sortOrder": 'asc'
            }
          }).then(data => {
            if (data.data.items.length > 0) {
              uni.setStorageSync("exams", data.data.items)
            }
            resolve(data.data.items)
          }).catch(err => {
            reject(err)
          })
        }).catch(err => {
          reject(err)
        })
    })
  })
}

/**
 * 获取推荐课表
 */
export function getRecommendCourses(params) {
  return new Promise((resolve, reject) => {
    if (params == undefined || params === null) {
      reject("需要参数")
    } else if (params.xnm == undefined) {
      params.xnm = '2020'
    } else if (params.xqm == undefined) {
      params.xnm = '12'
    } else if (params.xqh_id == undefined) {
      params.xqh_id = '1'
    } else if (params.njdm_id == undefined || params.zyh_id == undefined || params.bh_id == undefined) {
      reject("需要参数njdm_id(年级代码，eg:2017)，zyh_id(专业代码，eg:3146)，bh_id(班级代码，eg:I171461)")
    }
    login()
      .then(() => {
        uni.request({
          url: app.globalData.server.edu +
            "/jwglxt/kbdy/bjkbdy_cxBjKb.html?gnmkdm=N214505",
          method: "POST",
          withCredentials: true,
          cookie: true,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: params
        }).then(data => {
          if (data.data != null && data.data != '') {
            resolve(data.data)
          } else {
            reject("请求返回数据错误")
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
  })
}

/**
 * 获取学院信息
 * @param {Object} params 
 */
export function getJgList(params) {
  return new Promise((resolve, reject) => {
    login()
      .then(() => {
        uni.request({
          url: app.globalData.server.edu +
            "/jwglxt/xtgl/comm_cxJgdmList.html?gnmkdm=N214505",
          method: "GET",
          withCredentials: true,
          cookie: true,
          data: params
        }).then(data => {
          if (data.data != null && data.data !== '') {
            resolve(data.data)
          } else {
            reject("请求返回数据错误")
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
  })
}


export function getZyList(params) {
  return new Promise((resolve, reject) => {
    login()
      .then(() => {
        uni.request({
          url: app.globalData.server.edu +
            "/jwglxt/xtgl/comm_cxZydmList.html?gnmkdm=N214505",
          method: "GET",
          withCredentials: true,
          cookie: true,
          data: params
        }).then(data => {
          if (data.data != null && data.data !== '') {
            resolve(data.data)
          } else {
            reject("请求返回数据错误")
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
  })
}


export function getZyfxList(params) {
  return new Promise((resolve, reject) => {
    login()
      .then(() => {
        uni.request({
          url: app.globalData.server.edu +
            "/jwglxt/xtgl/comm_cxZyfxList.html?gnmkdm=N214505",
          method: "GET",
          withCredentials: true,
          cookie: true,
          data: params
        }).then(data => {
          if (data.data != null && data.data !== '') {
            resolve(data.data)
          } else {
            reject("请求返回数据错误")
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
  })
}


export function getBjList(params) {
  return new Promise((resolve, reject) => {
    login()
      .then(() => {
        uni.request({
          url: app.globalData.server.edu +
            "/jwglxt/xtgl/comm_cxBjdmList.html?gnmkdm=N214505",
          method: "GET",
          withCredentials: true,
          cookie: true,
          data: params
        }).then(data => {
          if (data.data != null && data.data !== '') {
            resolve(data.data)
          } else {
            reject("请求返回数据错误")
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
  })
}
