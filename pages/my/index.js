// pages/my/index.js
// 获取应用实例
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    info: [],
    isHas: false,
    Members: [
      {
        name: '我的卡包',
        url: '/pages/card-package/index',
        img: '../../images/icon/package.png'
      },
      {
        name: '积分中心',
        url: '/pages/my/integral',
        img: '../../images/icon/integral.png'
      },
      {
        name: '红包提现',
        // url: '/pages/order-list/index?id=3',
        img: '../../images/icon/red.png'
      }
    ],
    information: [
      {
        name: '个人信息',
        url: '/pages/add-adr/index',
        img: '../../images/icon/information.png'
      },
      {
        name: '收货地址',
        url: '/pages/address/index',
        img: '../../images/icon/address.png'
      },
      {
        name: '评价中心',
        url: '/pages/evaluation/index',
        img: '../../images/icon/evaluation.png'
      }
    ],
  },
  //点击付款 跳转到“我的订单”
  jumpOrder:function(e){
    wx.navigateTo({
      url: '/pages/order-lists/index',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userInfo'));  
  },

  /**
   * 菜单列表导航跳转
   */
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let _this = this;
    let _this = this;
    _this.onRefrech()
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    if(!App.checkIsLogin()){
      return false
    }
    App._post_form('User/order_list', {}, result => {
      console.log(result.info)
      var info = result.info;
      console.log(info);
      _this.setData({
        info: info,
        isHas:false,
      })
      console.log(_this.data.isHas);
      console.log(!_this.data.info);
      if(result.info[0]){
        console.log(3333)
        var goods_info = info[0].goods_info[0];
        var sum_price = info.sum_price;
        var total_num = info.total_num;
        console.log(info);
        _this.setData({
          // info: info,
          isHas: true,
          goods_info: goods_info,
          sum_price: sum_price,
          total_num: total_num
        })
      }
      
    }, false, () => {
      wx.hideLoading();
    });

   
    // 设置tabbar的选中状态，要在每个tab页面的onShow中设置
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 3
      })
    }
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
        });
      }
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

  //下拉刷新
  onPullDownRefresh:function()
  {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    
    //模拟加载
    setTimeout(function()
    {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
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
  //  事件函数--监听页面数据刷新
  onRefrech: function(e) {
   
  },
})