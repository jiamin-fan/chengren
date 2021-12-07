let App = getApp();
Page({
 
  data: {
  // tab切换
  currentTab: 0,
  aheight: 0,
  // unusered: [],
  },

  swichNav: function (e) {
  console.log(e);
  var that = this;
  if (this.data.currentTab === e.target.dataset.current) {
  return false;
  } else {
  that.setData({
  currentTab: e.target.dataset.current,
  })
  }
},
   
  swiperChange: function (e) {
  console.log(e);
  this.setData({
  currentTab: e.detail.current,
  })
  },
   
  onLoad: function (options) {
    // 请求数据
    let _this = this;
    App._post_form('User/user_coupons', {}, result => {
      var data = result.data;
      var unusered = data.data.unusered;
      var usered = data.data.usered;
      var expired = data.data.expired;
     _this.setData({
       unusered: unusered,
       usered: usered,
       expired: expired,
     });
    }, false, () => {
      wx.hideLoading();
    });
    
    // console.log(unusered.length);
    // 自适应选项卡
    this.setData({
      // unusered: unusered,
      aheight: 400 + 240 * 4,
    });
  },
   
  onReady: function () {
   
  // 生命周期函数--监听页面初次渲染完成
   
  },
   
  onShow: function () {
   
  // 生命周期函数--监听页面显示
   
  },
   
  onHide: function () {
   
  // 生命周期函数--监听页面隐藏
   
  },
   
  onUnload: function () {
   
  // 生命周期函数--监听页面卸载
   
  },
   
  onPullDownRefresh: function () {
   
  // 页面相关事件处理函数--监听用户下拉动作
   
  },
   
  onReachBottom: function () {
   
  // 页面上拉触底事件的处理函数
   
  },
   
  onShareAppMessage: function () {
   
  // 用户点击右上角分享
   
  return {
   
  title: 'title', // 分享标题
   
  desc: 'desc', // 分享描述
   
  path: 'path' // 分享路径
   
  }
   
  }
   
  })
