let App = getApp();
// pages/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    searchtext: '',
    isSearch: false,
    isHave: false,
    page: 1,
    result: [],
    telephone: '123',
    latitude: '',
    longitude: ''
  },

  
// 搜索
search: function (e) {
  // console.log(e.detail.value);
  var me = this;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  if (!e.detail.value || re.test(e.detail.value)) {
    wx.showToast({
      title: '地址不能为空！！！',
      icon: 'error',
      duration: 1500,
    })
  } else {
    var searchcity = e.detail.value;

    // var searchcity = e.detail.value;
    // console.log(me.data.latitude);
    // console.log(me.data.longitude);
    App._post_form('Storeinfo/storedata', {
      myLat: me.data.latitude,
      myLng: me.data.longitude,
      store_name: searchcity
    }, result => {
      console.log(result)
      var data = result.data;
      var store = data.data;
      // 请求错误
      if (result.code == 0) {
        console.log('1111111！！！！');
      } else {
        console.log('2222222！！！！');
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
          num: store.num,
          isSearch: true,
          isHave: true,
          page: 1,
          searchcity: searchcity
        })
      }
    });
  }
},
  
  // 打开地图导航
  seeMap: function(e){
    var me = this;
    let id = e.currentTarget.dataset.id;
    var stores = me.data.data.data;
    var latitude = stores[id].latitude
    var longitude = stores[id].longitude
    var name = stores[id].store_name
    var details = stores[id].details
    wx.getLocation({
      type: 'wgs84', 
      success: function (res) {
        console.log('打开地图导航去目的地');
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: Number(latitude),//要去的纬度-地址
          longitude: Number(longitude),//要去的经度-地址
          name: name,
          address: details
        })
      }
    })
  },
  // 拨号
  freeTell:function(e){
    var me = this;
    let id = e.currentTarget.dataset.id;
    var stores = me.data.data.data;
    console.log(stores)
    console.log(stores[id])
    wx.makePhoneCall({
      phoneNumber: stores[id].telephone
    })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    me.getStore();
    console.log(me.data)
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
              App._post_form('Storeinfo/storedata', {myLat:latitude,myLng:longitude,name:city}, result => {
                var code = result.code;
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
                  num: store.num,
                })
              }, false, () => {
                wx.hideLoading();
              });
            }else{
              me.setData({
                city: '获取失败'
              });
            }
        }
    })
  },

  // 获取门店信息
  getStore(){
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
        me.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
    })
  },

  // 选择门店回上一页（首页）
  backIndex: function (e) {
    console.log('回首页！！！！')
    var me = this;
    let idindex = e.currentTarget.dataset.id;
    var stores = me.data.data.data;
    var dis = stores[idindex].dis
    var id = stores[idindex].id
    console.log(stores)
    console.log(idindex)
    console.log(dis)
    console.log(id)
    App._post_form('Storeinfo/sele', {id: id,km: dis}, result => {
      var touch_data = result.data.data;
      var touch_id = touch_data.id;
      var touch_store_name = touch_data.store_name;
      me.setData({
        touch_data: touch_data,
        touch_id: touch_id,
        touch_store_name: touch_store_name,
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        mydata: {
          touch_id: touch_id,
          touch_store_name: touch_store_name,
        }
      })
      wx.navigateBack({//返回
        delta: 1
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