// pages/order-details/index.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  //弹框的效果
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
    })
    this.animation = animation
    animation.scale(1).step()
    this.setData({
     animationData: animation.export(),
     showModalStatus: true
    })
    setTimeout(function () {
     animation.scale(1).step()
     this.setData({
     animationData: animation.export()
     })
    }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
    })
    this.animation = animation
    animation.scale(1).step()
    this.setData({
     animationData: animation.export(),
    })
    setTimeout(function () {
     animation.scale(1).step()
     this.setData({
     animationData: animation.export(),
     showModalStatus: false
     })
    }.bind(this), 100)
    },
//点击付款 跳转到“确认订单”
jumpOrder:function(e){
  var order_id = e.currentTarget.dataset.id;
  console.log(order_status);
  wx.switchTab({
    url: '/pages/order/index'
  })
 },
//点击收货 改变当前的订单状态码为40，然后
changeStatus:function(e){
  var order_id = e.currentTarget.dataset.id;
  var order_status =  e.currentTarget.dataset.order_info.order_status;
  console.log(order_status);
  _this.setData({
    order_status: 40,
  })
 },
// 跳转到对应的添加评价页面
jumpEvaluation:function(e){
  var order_id= e.currentTarget.dataset.id;
  console.log(order_id);
  wx.navigateTo({
   url: '../evaluation/add?order_id='+order_id,
  })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
      App._post_form('User/order_listInfo', {order_id:options.order_id}, result => {
        var data = result.data[0];
        var address = data.address;
        var order_info = data.order_info;
        var goods_info = data.order_info.goods_info;
        console.log(data);
        _this.setData({
          order_info: order_info,
          address: address,
          goods_info: goods_info,
        })
      }, false, () => {
        wx.hideLoading();
      });
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