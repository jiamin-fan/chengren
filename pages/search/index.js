let App = getApp();

Page({
  data: {
    searchtext: '',
    isHave: true,
    isSearch: false,
    change1: "black",
    change2: 'black',
    bg1: false,
    bg2: false,
    isUp: 'false',
    isDown: 'false',
    active: 0,
    currentTab: 0,
    result: [],
    page: 1,
    btnClicked:true, //让点击事件同步操作
  },
  // 跳转到对应的详情页面
  changeGoods:function(e){
    var goods_id= e.currentTarget.dataset.id;
    console.log(goods_id);
    wx.navigateTo({
     url: '../good/index?goods_id='+goods_id,
    })
   },

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
  // 当点击以后， bg由true变为false，通过bg?'bg1':'bg2'得知，点击以后的效果为bg2
  saleSort: function(){
    var bg1 = !this.data.bg1;
    var result = this.data.result;
    if(bg1){
      result = this.downSort(result,'sales');
    }else{
      result = this.upSort(result,'sales')
    }

    this.setData({
      change1: bg1?'red':'black',
      change2: 'black',
      bg1: bg1,
      bg2: false,
      isUp: 'false',
      isDown: 'false',
      result: result
    })
  },
  priceSort: function(){
    var bg2 = !this.data.bg2;
    var result = this.data.result;
    if(bg2){
      result = this.upSort(result,'goods_price');
    }else{
      result = this.downSort(result,'goods_price')
    }

    this.setData({
      change2: 'red',
      change1: 'black',
      bg2: bg2,
      bg1: false,
      isUp: bg2?false:true,
      isDown: bg2?true:false,
      result: result
    })
  },

  upSort:function(res,type){
    var result = res;
    var type = type;
    if(type == 'goods_price'){
      for (let i = result.length-1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
          var a = parseInt(result[j].goods_price);
          var b = parseInt(result[j+1].goods_price);
          if(a>b){
            var c = result[j];
            result[j] = result[j+1];
            result[j+1] = c;
          }
        }
      }
    }else{
      for (let i = result.length-1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
          var a = parseInt(result[j].goods_initial)+parseInt(result[j].goods_actual);
          var b = parseInt(result[j+1].goods_initial)+parseInt(result[j].goods_actual);
          if(a>b){
            var c = result[j];
            result[j] = result[j+1];
            result[j+1] = c;
          }
        }
      }
    }
    return result;
  },

  downSort:function(res,type){
    var result = res;
    var type = type;
    if(type == 'goods_price'){
      for (let i = result.length-1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
          var a = parseInt(result[j].goods_price);
          var b = parseInt(result[j+1].goods_price);
          if(a<b){
            var c = result[j];
            result[j] = result[j+1];
            result[j+1] = c;
          }
        }
      }
    }else{
      for (let i = result.length-1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
          var a = parseInt(result[j].goods_initial)+parseInt(result[j].goods_actual);
          var b = parseInt(result[j+1].goods_initial)+parseInt(result[j].goods_actual);
          if(a<b){
            var c = result[j];
            result[j] = result[j+1];
            result[j+1] = c;
          }
        }
      }
    }
    return result;
  },

  onLoad: function (options) {
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
 
  //页面相关事件处理函数--监听用户下拉动作 
  onReachBottom: function () {
    console.log(123);
    let _this = this;
    let page = _this.data.page;
    if(_this.data.result.length == page*6){
      page++;
      App._get('search/index', {"goods_name": _this.data.searchtext,"page": page}, function(result) {
        var data = result.data;
        var result = data.result;
        _this.setData({
          result: _this.data.result.concat(result), //拼接两个数组
          page: page
        })
      });
    }
    

  },


})