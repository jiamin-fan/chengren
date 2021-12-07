// components/SearchInput/SearchInput.js
Component({
  /**
   * 组件的属性列表
   */
  options:{
    assGlobalClass: true
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
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
