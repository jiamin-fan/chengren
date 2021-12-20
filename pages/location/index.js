let App = getApp();
// pages/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchtext: '',
    isSearch: false,
    isHave: false,
    page: 1,
    result: [],
  },

  
  // 搜索
  search: function(e, longitude, latitude){
    console.log(e.detail.value);
    var me = this;
    // 返回坐标
    wx.getLocation({
      type: 'gcj02', //wgs84/gcj02
      altitude: true,
      isHighAccuracy: true,
      success: function (res) {
        me.lodeCity(res.longitude, res.latitude);
        console.log('本地的lat:' + res.latitude);
        console.log('本地的lon:' + res.longitude);
        console.log('搜索的city:' + e.detail.value);
        var searchtext = e.detail.value;
        App._get('Storeinfo/info', {myLat:res.atitude,myLng:res.longitude,name:searchtext}, function(result) {
          var data = result.data;
          if(data.result){
            var result = data.result;
            me.setData({
              result: result,
              isSearch: true,
              isHave: true,
              page: 1,
              searchtext: searchtext
            })
          }else{
            me.setData({
              result: [],
              isSearch: true,
              isHave: false,
              page: 1,
              searchtext: searchtext
            })
          }
        });
      },
    })
    
  },

  // 复制手机号
  copyPhone(phonenumber){
    wx.setClipboardData({
      data: phonenumber,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '号码已复制'
            })
          }
        })
      }
    })
    // wx.makePhoneCall({
    //   phoneNumber: 17325975954,
    //   success: function () {
    //     console.log("成功拨打电话")
    //   },
    // })
},

  // 选择门店回首页
  // goIndex(){
  //   wx.navigateTo({
  //     url: '/pages/index/index?id='+item.id,
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    // 返回坐标
    wx.getLocation({
      type: 'gcj02', //wgs84/gcj02
      altitude: true,
      isHighAccuracy: true,
      success: function (res) {
        console.log(res);
        console.log('纬度' + res.latitude);
        console.log('经度' + res.longitude);
        me.lodeCity(res.longitude, res.latitude);
      },
    })
  },
  lodeCity: function (longitude, latitude) {
    var me = this;
    wx.request({
        url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=jk99fxe50ngB9XoMOLwca50jIZvrVj7T&location=' + latitude + ',' + longitude + '&output=json',
        data: {},
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
            if (res && res.data) {
              console.log(res.data)
              console.log(res.data.result.addressComponent.city)
              var city = res.data.result.addressComponent.city;
              console.log('res...................');
              me.setData({
                city: city.indexOf('市') > -1 ? city.substr(0, city.indexOf('市')) :city
              });
              App._post_form('Storeinfo/info', {myLat:latitude,myLng:longitude,name:city}, result => {
                var data = result.data;
                var store = data.data;
                me.setData({
                  data: data,
                  store: store,
                  store_name: store.store_name,
                  dis: store.dis,
                  details: store.details,
                  b_time: store.b_time,
                  telephone: store.telephone,
                  choose: store.choose,
                  id: store.id,
                })
              }, false, () => {
                wx.hideLoading();
              });
              console.log(city);
            }else{
              me.setData({
                city: '获取失败'
              });
            }
        }
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