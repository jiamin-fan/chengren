// pages/rank/rank.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    // 选项卡：男榜为1，女榜为0
    choosed: 1
  },

  // 购物车跳转
addLike: function() {
  wx.navigateTo({
    url: '/pages/cart/index',
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getList(this.data.choosed)

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

  },

  // 自定事件
  /**
   * 用户点击选项卡
   */
  onChoose(e) {
    var that = this;
    var result = e.currentTarget.id;
    if (result == "man") {
      var index = 1
      that.getList(index)
      that.setData({
        choosed: index,
      })
    } else {
      var index = 2
      that.getList(index)
      that.setData({
        choosed: index,

      })
    }
  },

  // 发起请求
  getList(index) {
    var that = this;
    wx.request({
      url: 'https://renzhizhu.xunkt.cn/api/Goodslist/index',
      data: {
        choosed: index
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        const result = res.data.data;
        that.setData({
          goodsList: result
        })

      },
      fail(err) {
        console.log(err)
      }
    })
  },

  // 加入购物车
addCar(e) {
  if(!App.checkIsLogin()){
    wx.showToast({
      title: '请先登录',
      icon: 'error',
      duration: 2000
    });
    return false;
  }
  let _this = this;
  _this.setData({
    btnClicked: false
  })
      App._post_form('Cart/entropy', {goods_id: e.currentTarget.id,operate: 1,number: 1}, result => {
        var code = result.code;
        if(code == 1){
          if(result.data.data == "商品库存不足"){
            wx.showToast({
              title: '商品库存不足',
              icon: 'error',
              duration: 2000
            });
          }else{
            wx.showToast({
              title: '加购成功！',
              icon: 'success',
              duration: 2000
            });
          }
        }else{
          wx.showToast({
            title: '加购失败！',
            icon: 'failed',
            duration: 2000
          });
        }
      }, false, () => {
        // wx.hideLoading();
        setTimeout(
          ()=>{
            _this.setData({
              btnClicked:true
            })
          },2000
        )
      });
},
// 跳转到对应的详情页面
changeGoods:function(e){
  console.log(e)
  var goods_id= e.currentTarget.id;
  wx.navigateTo({
   url: '../good/index?goods_id='+goods_id,
  })
 },
})