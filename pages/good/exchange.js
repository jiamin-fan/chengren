// pages/good/exchange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Height2: "", // 轮播图2的高度
    carAdd: "",
  },

  // 设置图片2轮显高度
  imgHeight2: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var h = 25;
    //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    var swiperH = (winWid * imgh / imgw) + "px";
    this.setData({
      Height2: swiperH //设置高度
    })
  },

  changeAdd: function () {
    var that = this;
    console.log(111222333)
    wx.showModal({
      title: '兑换确认',
      content: '兑换礼品下单后如需退货，请联系客服',
      showCancel: false,
      confirmColor: '#f47767',
      success: function(res) {
       if (res.confirm) {
        console.log('用户点击确定')
        that.setData({
          carAdd: true,
          // isScroll: false
        })
       }
      }
     })
  },
//关闭弹窗
closeBg:function(){
  this.setData({
    carAdd: false,
    // isScroll: true
  })
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