// pages/index/index.js
let App = getApp();


Page({
  data: {
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
    // 分享给好友
    wx.showShareMenu({
      withShareTicket: true
    });

  },

    onReady: function () {

    // 生命周期函数--监听页面初次渲染完成

    },

    onShow: function () {
      let _this = this;
      App._post_form('index/index', {}, result => {

        var data = result.data;
        console.log(data);
        var imgUrls = data.slideshow;
        var category = data.category;
        var classify = data.classify;
        _this.setData({
          imgUrls: imgUrls,
          category: category,
          classify: classify
        })
      }, false, () => {
        wx.hideLoading();
      });



    // 设置tabbar的选中状态，要在每个tab页面的onShow中设置
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 0
      })
    }

    },

    onHide: function () {

    // 生命周期函数--监听页面隐藏

    },

    onUnload: function () {

    // 生命周期函数--监听页面卸载

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

    onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
    title: 'title', // 分享标题
    desc: 'desc', // 分享描述
    path: 'path' // 分享路径
    }

    }



})