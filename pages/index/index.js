// pages/index/index.js
let App = getApp();
// var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');
// var qqmapsdk;


Page({
  data: {
    province: '',
    city: '',
    latitude: '',
    longitude: '',

    latitude: 0,
    longitude: 0,
    // tab切换
    currentTab: 0,
    isLike: true,
    // goods_id: '',
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    btnClicked:true, //让点击事件同步操作
    Height: "", // 轮播图的高度
    Height2: "", // 轮播图2的高度
    mydata: [],
    touch_store_name: "",

    // 商品详情介绍
    detailImg: [
      "../../images/lun1.jpg",
      "../../images/lun2.jpg",
      "../../images/lun3.jpg",
      "../../images/lun4.jpg",
      "../../images/lun5.jpg",
      "../../images/lun6.jpg",
    ],
    category: [
      // '七天原液','28天'
    ],
   
  },
  
  //设置图片轮显高度
  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var h = 25;
    //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    var swiperH = (winWid * imgh / imgw) + "px";
    this.setData({
      Height: swiperH //设置高度
    })
  },
  //设置图片2轮显高度
  imgHeight2: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var h = 25;
    //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    var swiperH = (winWid * imgh / imgw) + "px";
    this.setData({
      Height2: swiperH //设置高度
    })
  },
// 加入购物车
addCar(e) {
  console.log(e);
  if(!App.checkIsLogin()){
    wx.showToast({
      title: '请先登录',
      icon: 'error',
      duration: 2000
    });
    return false;
  }
  let _this = this;
  _this.setData({
    btnClicked: false
  })
      App._post_form('Cart/entropy', {goods_id: e.currentTarget.id,operate: 1,number: 1}, result => {

        var code = result.code;
        if(code == 1){
          if(result.data.data == "商品库存不足"){
            wx.showToast({
              title: '商品库存不足',
              icon: 'error',
              duration: 2000
            });
          }else{
            wx.showToast({
              title: '加购成功！',
              icon: 'success',
              duration: 2000
            });
          }
        }else{
          wx.showToast({
            title: '加购失败！',
            icon: 'failed',
            duration: 2000
          });
        }
       
      }, false, () => {
        // wx.hideLoading();
        setTimeout(
          ()=>{
            _this.setData({
              btnClicked:true
            })
          },2000
        )
      });


},
// 跳转到对应的详情页面
changeGoods:function(e){
  var goods_id= e.currentTarget.dataset.id;
  console.log(goods_id);
  wx.navigateTo({
   url: '../good/index?goods_id='+goods_id,
  })
 },
 
// 跳转到活动页面
 activityCenter: function() {
  wx.navigateTo({
    url: './activity-center'
  });
},
//轮播图点击事件
onSwiperTap: function (event) {
  var id = event.target.id;
  console.log("wwwwwww");
  console.log(event.target);
  console.log("qqqqqqq");
  console.log(id);
  // if(id != 0){
  //   var id= event.target.dataset.Id;
    wx.navigateTo({
    //   url: "详细页的地址?id=" + id
        url: "/pages/activity/index?classify_id=" + id
      })
    // }
    
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },
  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },

  onLoad: function (options) {
    var me = this;
    // qqmapsdk = new QQMapWX({
    //   key: '2083cc0b8cd7eddbe773532f24eef1af' //密钥
    // });
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
 
    console.log('111222333sss');
    let _this = this;
    let l=_this.data.latitude;
    console.log(l);
    // 分享给好友
    wx.showShareMenu({
      withShareTicket: true
    });

    
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
                App._post_form('Storeinfo/index', {myLat:latitude,myLng:longitude,name:city}, result => {
                  var data = result.data;
                  var jingwei = data.data;
                  me.setData({
                    jingwei: jingwei,
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


  onReady: function () {

    // 生命周期函数--监听页面初次渲染完成

  },

  onShow: function () {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    App._post_form('index/index', {}, result => {

      var data = result.data;
      // console.log(data);
      var imgUrls = data.slideshow;
      var category = data.category;
      var classify = data.classify;
      _this.setData({
        imgUrls: imgUrls,
        category: category,
        classify: classify
      })
    }, false, () => {
      // wx.hideLoading();
    });

  // 设置tabbar的选中状态，要在每个tab页面的onShow中设置
  if (typeof this.getTabBar === 'function' && this.getTabBar()) {
    this.getTabBar().setData({
      curIndex: 0
    })
  }
  
  // 接收门店页面传过来的值
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]; //当前页面
  let json = currPage.data.mydata;
  let touch_store_name = json.touch_store_name;
  console.log(json)//为传过来的值
  console.log(touch_store_name)//为传过来的门店名
  _this.setData({
    touch_store_name: touch_store_name
  })
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
    onHide: function () {

    // 生命周期函数--监听页面隐藏

    },

    onUnload: function () {

    // 生命周期函数--监听页面卸载

    },

    //下拉刷新
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function(){
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
  },
  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
    title: 'title', // 分享标题
    desc: 'desc', // 分享描述
    path: 'path' // 分享路径
    }
  }



})