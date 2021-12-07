// pages/demo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [
      {
        goodimg: '../../images/lun4.jpg',
        goodname: '泰山原浆10°',
        sales: '888',
        price: '109.09',
      },
      {
        goodimg: '../../images/lun4.jpg',
        goodname: '泰山原浆10°',
        sales: '888',
        price: '109.09',
      },
      {
        goodimg: '../../images/lun4.jpg',
        goodname: '泰山原浆10°',
        sales: '888',
        price: '109.09',
      },
    ]
  },
  // 加入购物车
  addCar() {
    wx.showToast({
      title: '加入购物车成功！',
      icon: 'success',
      duration: 2000
    });
  },
  //首页跳转
  addIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 购物车跳转
  addLike: function() {
    wx.switchTab({
      url: '/pages/cart/index',
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