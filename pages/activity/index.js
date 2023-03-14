let App = getApp();

Page({
  /**
   * 页面的初始数据
   * Linyufan.com
   */
  data: {
    btnClicked:true, //让点击事件同步操作
    goods_list: [],
    titletext: ''
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
  // var goods_id= e.currentTarget.dataset.id;
  // console.log(goods_id);
  // wx.navigateTo({
  //  url: '../good/index?goods_id='+goods_id,
  // })
  var goods_id= e.currentTarget.dataset.id;
  var goods_type= e.currentTarget.dataset.type;
  console.log('1'); 
  console.log(e.currentTarget.dataset);
  if(goods_type == 1){
    wx.redirectTo({
      //我改的
      url: '../good/good?goods_id='+goods_id,
      //结束 
    })
  }else{
    wx.navigateTo({
      url: '../good/index?goods_id='+goods_id,
     })
  }
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

// 格式化商品名
formatGoodsName(goodName){
 if(goodName.length>20){
   return slice(0,20)+'…'
 }else{
   return goodName
 }
},

  onLoad: function (options) {

    // console.log(options.classify_id);
    
    //请求数据
    let _this = this;
    App._get('Classify/index', {classify_id: options.classify_id}, function(result) {
      var data = result.data;
      var classify = data.classify;
      var goods_list = data.goods_list;
      _this.setData({
        goods_list: goods_list,
        titletext: classify.classify_title
      })
    });

    setTimeout(function (){
      //修改title
      wx.setNavigationBarTitle({
        title: _this.data.titletext
      })
    },1000)

  },

  onReady: function () {

    // 生命周期函数--监听页面初次渲染完成
    

    },


})