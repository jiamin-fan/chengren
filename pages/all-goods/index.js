let App = getApp();
Page({
  data: {
    classfy: [],
    currentTab: 0,
    aheight: 0,
    active: 0,
    category: [],
    btnClicked:true, //让点击事件同步操作
    top_active: 0,
    top_current_tab:0,
    
  },
   //首页跳转
   addIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 购物车跳转
  addLike: function() {
    wx.navigateTo({
      url: '/pages/cart/index',
    })
  },
  // 跳转到对应的详情页面
changeGoods:function(e){
  var goods_id= e.currentTarget.dataset.id;

  wx.navigateTo({
   url: '../good/index?goods_id='+goods_id,
  })
 },
 // 加入购物车
addCar(e) {
  
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
// 点击顶部选项卡
topChoose(e){
  var page = this;
  var id = e.target.id;
  page.setData({
    top_active:id,
  })
  page.getGoods(id);
},

// 男/女频分类请求数据
getGoods(genderID){
  var page = this;
  wx.request({
    url: 'https://renzhizhu.xunkt.cn/api/Category/typeshow',
    method:'POST',
    
    data:{
      type_num:genderID
    },
    header:{
      'content-type': 'application/x-www-form-urlencoded' 
    },
    success(res){
      var data = res.data;
      var category = data.data.category;
       var active_num=page.data.active;
      var classfy=[]; 
      for(let i = 0;i < category.length; i++){
        classfy[i] = i;
       }
       if(active_num>category.length-1){
        page.setData({
          active:0,
          currentTab:0
        })   
       }
      page.setData({
        category: category,
        classfy:classfy
      })
      //结束
     
      page.setData({
        category: category,
      })
    },
    fail(error){
      
    }
  })
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
    for(var i=0 ;i < length1;i++){
      var length2 = category[i].goods.length;
      category[i].active=100 + length2 * 220 ;
    };
      // this.setData({
      //   category: category,
      // });
  },
  // 初始化分类页面
  initCategory(){
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
  },
  tapAll(e){
    var page = this;
    page.initCategory();
    var id = e.target.id;
    page.setData({
      top_active:id
    })
  },

  onLoad: function (options) {
  // 生命周期函数--监听页面加载
    // 自适应选项卡
    this.adaptive();
    let _this = this;
    _this.initCategory();
     _this.getGoods(App.globalData.top_selected)
  },
  onShow: function () {
    //请求数据
    let _this = this;
    
    // 设置tabbar的选中状态，要在每个tab页面的onShow中设置
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 1
      })
    } 
    // 根据首页点击男频或女频而改变顶部菜单的样式
    _this.setData({
      top_active:App.globalData.top_selected
    })
   
     _this.getGoods(App.globalData.top_selected)
    
   
    },
    onReady(){
      let _this = this;
       _this.getGoods(App.globalData.top_selected)
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
       // 用户点击右上角分享
  onShareAppMessage: function () {
        return {
        title: 'title', // 分享标题
        desc: 'desc', // 分享描述
        path: 'pages/all-goods/index' // 分享路径
        }
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {  
    App.globalData.top_selected=0
  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {
    App.globalData.top_selected=0
  },
})