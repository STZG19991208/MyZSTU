<view class="container">
  <view class="title">即时课表</view>
  <navigator class="coursecard" url="{{courseurl}}">
    <view class="top">
      <view class="content" wx:if="{{hasCourse}}">
        <view class="course-item">课程名称: {{courseName}}</view>
        <view class="course-item">上课时间: {{courseTime}}</view>
        <view class="course-item">上课教师: {{courseTeacher}}</view>
        <view class="course-item">上课地点: {{coursePlace}}</view>
      </view>  
      <view class="tip" wx:else>{{tip}}</view>
    </view>
    <view class="bottom">点击查看全部课表</view>
  </navigator>
  <view class="title">教务查询</view>
  <view class="btn_group">
    <navigator class="btn exam" url="{{examurl}}">
      <image class="btn_icon" src="../../images/exam.svg"></image>
      <view class="btn_info">考试查询</view>
    </navigator>
    <navigator class="btn score" url="{{scoreurl}}">
      <image class="btn_icon" src="../../images/score.svg"></image>
      <view class="btn_info">成绩查询</view>
    </navigator>
  </view>
  <view class="btn_group">
     <navigator class="btn recommend" url="{{recommendurl}}">
      <image class="btn_icon" src="../../images/exam.svg"></image>
      <view class="btn_info">推荐课表</view>
    </navigator>
  </view>

  
  <view class="title">更多功能</view>
  <view class="btn_group">

  <!--
    <navigator class="btn ecard" url="{{ecardurl}}">
      <image class="btn_icon" src="../../images/ecard.svg"></image>
      <view class="btn_info">校园一卡通</view>
    </navigator>
    <navigator class="btn library" url="libinfo/libinfo">
      <image class="btn_icon" src="../../images/library.svg"></image>
      <view class="btn_info">掌上图书馆</view>
    </navigator>-->
    <navigator class="btn ecard" url="{{reservationurl}}">
      <image class="btn_icon" src="../../images/ecard.svg"></image>
      <view class="btn_info">电脑维修</view>
    </navigator>
  </view>
  
  <ad unit-id="3a75831ad60ca7d959544c27116d3008"></ad>
</view>
