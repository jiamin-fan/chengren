// pages/my/collect.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //修改title
    wx.setNavigationBarTitle({
      title: '我的收藏'
    });
    let _this = this;
    App._post_form('User/show_collect', {}, result => {
      var data = result.data;
      var goods = data.data;
      _this.setData({
        goods: goods
      })
    }, false, () => {
      wx.hideLoading();
    });
  },
// 跳转到对应的详情页面
changeGoods:function(e){
  var goods_id= e.currentTarget.dataset.id;
  console.log(goods_id);
  wx.navigateTo({
   url: '../good/index?goods_id='+goods_id,
  })
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