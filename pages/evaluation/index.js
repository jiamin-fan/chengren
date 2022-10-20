let App = getApp();
Page({
  data: {
  // tab切换
  aheight: 0,
  currentTab: 0,
  comment: [],
  evaluated: []
  },

  swichNav: function (e) {
  console.log(e);
  var that = this;
  if (e.target.dataset.current == 0) {
    that.setData({
      currentTab: 0,
   })
   that.onLoad();
  }else {
    App._post_form('Comment/order', {type: 1}, result => {
      var data = result.data;
      var res = data.res;
     that.setData({
       res: res,
       currentTab: 1,
     });
    }, false, () => {
      wx.hideLoading();
    });
   
  }
  },

  swiperChange: function (e) {
    console.log(e);
    this.setData({
    currentTab: e.detail.current,
    })
  },

  // 跳转立即评价
  addEvaluation: function(e) {
    var order_id= e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './add?order_id='+order_id,
    });
  },
  onLoad: function (options) {
  // 生命周期函数--监听页面加载
    // 请求数据
  let _this = this;
  App._post_form('Comment/order', {type: 0}, result => {
    var data = result.data;
    var res = data.res;
   _this.setData({
     res: res,
   });
  }, false, () => {
    wx.hideLoading();
  });

  // 自适应选项卡
  this.setData({
    aheight: 400 + 270 * 15, //需要修改
  });

  },

  onReady: function () {
  // 生命周期函数--监听页面初次渲染完成
  },

  onShow: function () {
  // 生命周期函数--监听页面显示
  //判断是否存在 
  if(wx.getStorageSync("numData")){
    let _this = this;
    _this.setData({
      currentTab: 1,
      })
    wx.removeStorageSync("numData")
     
    App._post_form('Comment/order', {type: 1}, result => {
      var data = result.data;
      var res = data.res;
    _this.setData({ 
      res: res,
    });
    }, false, () => {
      wx.hideLoading();
    });
  }
  
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
