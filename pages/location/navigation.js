// pages/location/navigation.js
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
    let that=this
        qqmapsdk.geocoder({
            address: '广东省广州市增城区中新镇风光路393号',
            success:function (res) {
                // var res = res.result;
                // console.log(res);
                // var latitude = res.location.lat;
                // var longitude = res.location.lng;
                wx.openLocation({ //​使用微信内置地图查看位置。
                    latitude:  latitude, //要去的纬度-地址
                    longitude: longitude, //要去的经度-地址
                    address: '广东省广州市增城区中新镇风光路393号',
                    name:''
                })
            }
        })
  },
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '2083cc0b8cd7eddbe773532f24eef1af' //密钥
    });
    var that = this
    if (options.key == '点击搜索'){
      console.log('搜索后跳转携带的参数:',options)
      var long = option.long;
      var lati = options.lati;
      var markers = [];
      var MapHeight = this.data.MapHeight;
      var cityDic = { id: 1, latitude: lati, longitude: long, iconPath: '../../images/icon/call.png', width: 35, height: 35}
      markers.push(cityDic);

      that.setData({
        markers,
        latitude: lati,
        longitude: long,
        showWindow: true,
        compName: options.compName,
        MapHeight: '90vh',
        iconBottom: '230rpx',
        backBottom: '150rpx'
      })
    }else{
      wx.getLocation({
        type: 'gcj02', //wgs84/gcj02
        success: function (res) {
          console.log('纬度' + res.latitude);
          console.log('经度' + res.longitude);
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map')
    this.mapCtx.moveToLocation()
  },

  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  PointBackAction(e){
    console.log('回归当前定位点')
    this.mapCtx.moveToLocation()

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