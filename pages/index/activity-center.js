// pages/evaluation/add.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
  },
  onTargetMenus(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
    /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },
  onLogin() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
        let _this = this;
        App.getUserInfo(e, () => {
          wx.setStorageSync('userInfo', e.userInfo);
          //  console.log(e.userInfo);
          _this.setData({
            isLogin: true
          })
          wx.showToast({
            title: '领取成功！',
            icon: 'success',
            duration: 2000
          });
          _this.onLoad()

        });
      }
    })
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
    //修改title
    wx.setNavigationBarTitle({
      title: '酷夏惊喜活动中心'
    });
    let _this = this;
      App._post_form('coupon/lists', {}, result => {

        var data = result.data;
        console.log(data);
        var list = data.list;
        _this.setData({
          list: list,
        })
      }, false, () => {
        wx.hideLoading();
      });

  },

  getCoupon: function(e) {
    let _this = this;
    let coupon_id = e.target.dataset.id;
    App._post_form('coupon/receive', {
      coupon_id:coupon_id
    }, function(result) {
      _this.onLoad();
    });
    return false;
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
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });

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