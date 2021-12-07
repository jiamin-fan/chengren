Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1,
    getType:[],
    type: '',
    child_type:'',
  },
  onLoad: function (options) {
    var that = this;
    that.getType();
    that.c_index();
    that.setChildType();
    console.log(options)
  },
  onShow:function(){
    var that = this;
    var time = require('../api/time.js');//引用公共函数设置缓存
    var value = time.get('c_index');
    var index = that.data.index;
    if(value){
      that.setData({
        'id': index
      })
    }else{
      that.setData({
        'id': 56
      })
    }
    
  },

  c_index:function(e)
  {
    var that = this;
    var time = require('../api/time.js');//引用公共函数设置缓存
    var value = time.get('c_index') || [];
    that.setData({
      index:value
    })
  },
  getType:function(){
    var that = this;
    var time = require('../api/time.js');//引用公共函数设置缓存
    var value = time.get('type')
    if (value) {
      that.setData({
        type: value
      })
    } else {
      wx.request({
        url: 'https://xapp.ixunda.net/index/type',
        success(res) {
          if (res.data.code) {
            that.setData({
              type: res.data.data
            })
            time.put('type', res.data.data, 3600)
          }
        }
      })
    }
  },
  /**
   获取分类数据 
   **/
  tab:function(e){
    var that = this;
    var id = e.currentTarget.dataset.current;
    that.setData({
      id:id
    })
  },
  setChildType: function(){
    var that = this;
    var type = that.data.type;
    var index = [];
    var i = 0;
    for(var key in type){
      for (var k in type[key].child){
        index[i] = type[key].child[k]
        i++; 
      }
    }
    that.setData({
      child_type: index
    })
  },
  nav:function(e){
    var that = this;
    var id = e.currentTarget.dataset.current;
    var child_type = that.data.child_type;
    for(var val in child_type)
    {
      if(child_type[val].id == id)
      {
        wx.navigateTo({
          url: '/pages/search-result/index?type_id=' + child_type[val].id + '&value=' + child_type[val].name,
        })
      }
    }
   
  }
})