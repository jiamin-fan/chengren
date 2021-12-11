let App = getApp();
// pages/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchtext: '',
    isSearch: false,
    
    region: [],
    customItem: '全部',

  },
  bindRegionChange: function (e) {
    var that = this;
    // console.log(e.detail.value);return false;
    var data_region = that.data.region[0]+','+that.data.region[1]+','+that.data.region[2];
    var region = e.detail.value[0]+','+e.detail.value[1]+','+e.detail.value[2];
    if(data_region == region){
      console.log('地区没有做出更改');
    }else{
      App._post_form('user/address_component_edit', {
        address_component: region,
      }, function(res) {
        that.setData({
          region: e.detail.value,
        });
      });
    }
  },
  getLocation: function(){
    const that = this
    var i = setInterval(function() {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
        success: function(res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })            
          var longitude = res.longitude
          var latitude = res.latitude
          that.loadCity(longitude, latitude)
          clearInterval(i)
        },
        fail: function() {
          wx.showToast({
            title: '手机定位未打开',
            icon: 'none',
            duration: 2000 
          })
        },
        complete: function() {
          // complete  
        }
      })
    }, 2000)
  },
  // 搜索
  search: function(e){
    console.log(e.detail.value);
    let _this = this;
    var searchtext = e.detail.value;
    App._get('search/index', {"goods_name": e.detail.value,"page": 1}, function(result) {
      var data = result.data;
      if(data.result){
        var result = data.result;
        _this.setData({
          result: result,
          isSearch: true,
          isHave: true,
          page: 1,
          searchtext: searchtext
        })
      }else{
        _this.setData({
          result: [],
          isSearch: true,
          isHave: false,
          page: 1,
          searchtext: searchtext
        })
      }
    });
  },

  // 复制手机号
  copyPhone(){
    wx.setClipboardData({
      data: '这是要复制的文字',
    })
    // wx.makePhoneCall({
    //   phoneNumber: 17325975954,
    //   success: function () {
    //     console.log("成功拨打电话")
    //   },
    // })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(user.address_component == null || user.address_component == ''){
      that.setData({
        region: ['获取所在地区,']
      });
      //获取当前地址
      wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation']  undefined-表示初始化进入该页面 false-表示非初始化进入该页面,且未授权
        if (res.authSetting['scope.userLocation'] != true) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getLocation()
            },
            fail: function(error) {
              wx.showModal({
                title: '提示',
                content: '您未开启保定位权限，请点击确定去开启权限！',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                },
                fail: function() {
                  wx.showToast({
                    title: '未获取定位权限，请重新打开设置',
                    icon: 'none',
                    duration: 2000 
                  })
                }
              })
            }
          })
        }else {
          that.getLocation()
        }
      }
    })
    }else{
      // console.log(123)
      that.setData({
        region: user.address_component.split(",")
      });
    }

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