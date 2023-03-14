// pages/hello/index.js
  let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    phoneNumber: 0,
    array: ['未知', '男', '女'],
    objectArray: [
      {
        id: 0,
        name: '未知'
      },
      {
        id: 1,
        name: '男'
      },
      {
        id: 2,
        name: '女'
      },
    ],
    date: '获取出生日期',
    region: [],
    user: '',
    order_list: '',
    index: 0,
    multiIndex: [0, 0, 0],
    time: '12:01',
    customItem: '全部',
    latitude: '',
    longitude: '',
  },
  // 跳转页面
  changeName:function(){
    var nickName= wx.getStorageSync('userInfo').nickName;
    // console.log(nickName);
    wx.navigateTo({
     url: '../name/index?nickName='+nickName,
    })
   },
  

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '更好的服务', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  onLoad: function (e) {
    setTimeout(function (){
      //修改title
      wx.setNavigationBarTitle({
        title:"个人信息"
      })
    },100)
    var that = this
    // console.log(that.data.region);
    //请求当前用户信息
    App._get('User/index', {}, function(result) {
      var data = result.data;
      var user  = data.user ;
      that.setData({
        index: user.gender
      });
      that.setData({
        date: user.birthday?user.birthday:'获取出生日期'
      });
      // console.log(user)
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
      // console.log(result)
      var order_list  = data.order_list ;
      that.setData({
        user: user,
        phoneNumber: data.user.mobile?data.user.mobile:'0',
      })
    });
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
  loadCity: function(longitude, latitude) {
    var that = this
    //请求的地址是腾讯地图，参考文档https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview
    wx.request({
      url:'https://apis.map.qq.com/ws/geocoder/v1/?location='+latitude + ','+longitude +'&key=SSSBZ-SQZK6-U3XSL-EPA5P-6VNK6-ANF4P&get_poi=1',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        var address = res.data.result.address_component
        //这里将地址异步提交给后端
        App._post_form('user/address_component_edit', {
          address_component: address.province+','+address.city+','+address.district,
        }, function(res) {
          that.setData({
            region: [address.province, address.city, address.district],
          });
        });
      },
      fail: function() {  
        console.log("失败")
      },
      complete: function() {
        // complete  
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
    this.onLoad()

  },

  getPhoneNumber (e) {
    var that = this;
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          console.log('未授权手机号')
        }else{
          // return false;
          var ency = e.detail.encryptedData;
          var iv = e.detail.iv;
          var sessionk = wx.getStorageSync('session_key');
          App._post_form('user/getPhone', {
            encrypdata: ency,
            ivdata: iv,
            sessionkey: sessionk
          }, function(result) {
            console.log(result.data);
            that.setData({
              phoneNumber:result.data
            });
            App._post_form('user/phone_edit', {
              phoneNumber: that.data.phoneNumber
            }, function(res) {
              that.setData({
                phoneNumber: result.data.phoneNumber
              });
            });
          });
        }
      },fail () {
        // session_key 已经失效，需要重新执行登录流程
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
      }
    })
  },

  bindPickerChange: function(e) {
    var that = this;
    var gender = e.detail.value;
    console.log('性别发送选择改变，携带值为', gender)
    App._post_form('user/gender_edit', {
      index:gender
    },function(res){
      that.setData({
        index: e.detail.value  
      });
      
    })
  },

  bindDateChange: function(e) {
    var that = this;
    // console.log('生日发送选择改变，携带值为', e.detail.value)
    var data_date = that.data.date;
    var date = e.detail.value;
    if(data_date == date){
      console.log('生日没有做出更改');
    }else{
      App._post_form('user/birthday_edit', {
        birthday: date,
      }, function(res) {
        that.setData({
          date: e.detail.value,
        });
      });
    }
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
  
})