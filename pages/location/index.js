let App = getApp();
// pages/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchtext: '',
    isSearch: false,

  },
  // 搜索
  search: function(e){
    console.log(e.detail.value);
    let _this = this;
    var searchtext = e.detail.value;
    App._get('search/index', {"goods_name": e.detail.value,"page": 1}, function(result) {
      var data = result.data;
      if(data.result){
        var result = data.result;
        _this.setData({
          result: result,
          isSearch: true,
          isHave: true,
          page: 1,
          searchtext: searchtext
        })
      }else{
        _this.setData({
          result: [],
          isSearch: true,
          isHave: false,
          page: 1,
          searchtext: searchtext
        })
      }
    });
  },

  // 复制手机号
  copyPhone(){
    wx.setClipboardData({
      data: '这是要复制的文字',
    })
    // wx.makePhoneCall({
    //   phoneNumber: 17325975954,
    //   success: function () {
    //     console.log("成功拨打电话")
    //   },
    // })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})