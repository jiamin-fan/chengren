let App = getApp();
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    RefrashState: false,
    showWindow: false,
    markers: [],
    compName: '',
    MapHeight: '100vh',
    iconBottom: '100rpx',
    backBottom: '0rpx',

  },

  // 打开地图导航
  seeMap: function(){
    console.log('打开地图导航去目的地');
    // demo.geocoder({
    //   address: this.data.adrr,
    //   success: res => {
    //       wx.openLocation({
    //           latitude: res.result.location.lat,
    //           longitude: res.result.location.lng,
    //           scale: 28
    //       })
    //   },
    //   fail: function(res) {
    //       console.log(res);
    //   },
    //   complete: function(res) {
    //       console.log(res);
    //   }
    // });
  },

  onLoad: function (options) {
    var me = this;
    qqmapsdk = new QQMapWX({
      key: '2083cc0b8cd7eddbe773532f24eef1af' //密钥
    });
    console.log(this.options.id)
    App._post_form('Storeinfo/sele', {id:this.options.id,num:1}, result => {
      var data = result.data;
      var store = data.data;
      // 地图的标记点:
      var arr2 =[{
        iconPath: "../../images/icon/adr2.png",
        width: 50,
        height: 54,
        latitude: store.latitude,
        longitude: store.longitude,
        name: store.store_name,
      }];
      me.setData({
        data: data,
        store: store,
        store_name: store.store_name,
        details: store.details,
        latitude: store.latitude,
        longitude: store.longitude,
        markers: arr2,
      })
    }, false, () => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map')
    // this.mapCtx.moveToLocation()
  },

  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 回归标记点
  PointBackAction(e){
    var me = this;
    // console.log('回归当前定位点')
    this.mapCtx.moveToLocation({
      latitude: this.data,
      longitude: this.longitude,
      success:() => {
        console.log(me)
        console.log(latitude)
        console.log('我移过去了')
    },
    })
    // this.mapCtx = wx.createMapContext('map')
    this.mapCtx.getRegion({
      success: function (res) {
        console.log('当前屏幕视野',res);
        var num = (res.northeast.longitude - res.southwest.longitude) * 0.1
        northLong: res.northeast.longitude - num;
        northLati: res.northeast.latitude - num;
        southLong: res.southwest.longitude + num;
        southLati: res.southwest.latitude + num;
      },
    })
  },
  RefrashAction(e){
    console.log('刷新按钮')
    var RefrashState = this.data.RefrashState;
    RefrashState = !RefrashState
    this.setData({
      RefrashState
    })
  },
  PlanAction(e){
    console.log('点击拜访行程')
    wx.navigateTo({
      url: '/pages/index/index', //到首页
    })
  },
  markersAction(e){
    console.log('点击标记点')
    this.setData({
      showWindow: true,
      MapHeight: '90vh',
      iconBottom: '230rpx',
      backBottom: '150rpx'
    })
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