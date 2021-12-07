// pages/search-result/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    search_result:'',
    goods:{},
    type_id:0,
    sell:0,
    price:0,
    time:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var name = options.value;
    if (options.type_id){
      var id =options.type_id;
    }else{
      var id = 0;
    }
    that.setData({
      search_result:name,
      id: options.id,
      type_id: options.type_id 
    })
    that.getGoods();
  },
  searchBox: function (options){
    var that = this;
    var name = options.detail.value.search_result;
    that.setData({
      search_result: name
    })
    if (name !="")
    {
      that.getGoods();
    }else{
      var goods = [];
      that.setData({
        search_result: name,
        goods:goods
      })
    }
  },
  getGoods: function () {
    var that = this;
    var time = require('../api/time.js');//引用公共函数设置缓存
    var search_result = that.data.search_result;
    var id = that.data.type_id;
    if(id > 0){
      var data = {'id': id}  
    }else{
      var data = { 'name': search_result }
    }
    wx.request({
        url: 'https://xapp.ixunda.net/index/goods',
        data: data,
        method: 'post',
        success(res) {
          that.setData({
            goods: res.data.data
          })
          time.put('search_goods', res.data.data,3600);
        }
      })
  },
  togoods:function(e){
  
    wx.navigateTo({
      url: '/pages/good/index?id=' + e.currentTarget.id,
    })
  },
  sales:function(e)
  {
    var that = this;
    var value = that.data.goods;
    var id = that.data.sell;
    that.setData({
      sell:(id+1)%2
    })
    for(var i = 0; i < value.length; i++)
    {
      if(id)
      {
        for (var j = 0; j < value.length; j++) {
          if (parseInt(value[i].old_sold) > parseInt(value[j].old_sold)) {
            var bool = value[i];
            value[i] = value[j];
            value[j] = bool;
          }
        }
      }else
      {
        for (var j = 0; j < value.length; j++) {
          if (parseInt(value[i].old_sold) < parseInt(value[j].old_sold)) {
            var bool = value[i];
            value[i] = value[j];
            value[j] = bool;
          }
        }
      }
    }
    that.setData({
      goods:value
    }) 
  },
  //销量排序
  //按价格排序
  byprice:function(){
    var that = this;
    var value = that.data.goods;
    var id = that.data.price;
    that.setData({
      price: (id + 1) % 2
    })
    for (var i = 0; i < value.length; i++) {
      if (id) {
        for (var j = 0; j < value.length; j++) {
          if (parseInt(value[i].price) > parseInt(value[j].price)) {
            var bool = value[i];
            value[i] = value[j];
            value[j] = bool;
          }
        }
      } else {
        for (var j = 0; j < value.length; j++) {
          if (parseInt(value[i].price) < parseInt(value[j].price)) {
            var bool = value[i];
            value[i] = value[j];
            value[j] = bool;
          }
        }
      }
    }
    that.setData({
      goods: value
    }) 
  },
  bytime:function(){
    var that = this;
    var value = that.data.goods;
    var id = that.data.time;
    that.setData({
      time: (id + 1) % 2
    })
    for (var i = 0; i < value.length; i++) {
      if (id) {
        for (var j = 0; j < value.length; j++) {
          if (parseInt(value[i].id) > parseInt(value[j].id)) {
            var bool = value[i];
            value[i] = value[j];
            value[j] = bool;
          }
        }
      } else {
        for (var j = 0; j < value.length; j++) {
          if (parseInt(value[i].id) < parseInt(value[j].id)) {
            var bool = value[i];
            value[i] = value[j];
            value[j] = bool;
          }
        }
      }
    }
    that.setData({
      goods: value
    })
  },
  //综合,恢复原始
  original:function(){
    var that = this;
    var time = require('../api/time.js');//引用公共函数设置缓存
    that.setData({
      goods:time.get('search_goods')
    })
  }
})