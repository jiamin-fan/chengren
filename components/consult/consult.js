// components/consult/consult.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isLogin: false,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function () {
      let _this = this;
      _this.setData({
        isLogin: App.checkIsLogin()
      });
    },
    onLogin() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '更好的服务', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
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
  //  事件函数--监听页面数据刷新
  onRefrech: function(e) {
    
  },

  }
})
