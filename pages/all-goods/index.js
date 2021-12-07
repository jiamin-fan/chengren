let App = getApp();
Page({
  data: {
    classfy: [],
    currentTab: 0,
    aheight: 0,
    active: 0,
    category: [],
    btnClicked:true, //让点击事件同步操作
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
  // 跳转到对应的详情页面
changeGoods:function(e){
  var goods_id= e.currentTarget.dataset.id;
  console.log(goods_id);
  wx.navigateTo({
   url: '../good/index?goods_id='+goods_id,
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
  // 选项卡  主要是通过判断e.target.id的值 设置对应的id显示
  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
      active: id
    });
  },
  adaptive:function(){
    var category = this.data.category;
    var length1 = category.length;
    // console.log(length1);
    for(var i=0 ;i < length1;i++){
      var length2 = category[i].goods.length;
      category[i].active=100 + length2 * 220 ;
    };
    console.log(category);
      // this.setData({
      //   category: category,
      // });
  },

  onLoad: function (options) {

  // 生命周期函数--监听页面加载
    // 自适应选项卡
    this.adaptive();

  },
  onShow: function () {
    //请求数据
    let _this = this;
    App._get('Category/index', {}, function(result) {
      var data = result.data;
      var category = data.category;
      var classfy = [];
      for(let i = 0;i < category.length; i++){
       classfy[i] = i;
      }
      _this.setData({
        category: category,
        classfy: classfy,
      })
    });
    
    // 设置tabbar的选中状态，要在每个tab页面的onShow中设置
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 1
      })
    }

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
})