// pages/demo/index.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBlank: true,
    selectAll: false,
    startX: 0,
    startY: 0,
    count: 0, //实际金额
    discount: 0, // 合计金额
    sum: 0, //下单总数
    selectcount: 0, //判断全选
    isDiscount: false, //是否使用优惠
    reduce_price: 0, // 优惠的价格
    carts: [],
    coupon: [], //优惠券信息
    selectedgood: [],//勾选了的id
  },

  //  页面跳转到详情页
  switchToDetail: function(e) {
    
    wx.navigateTo({
      url: '/pages/good/index?goods_id=' + e.currentTarget.dataset.id,
    })
  },

  //勾选商品
  onSelectCard: function(e) {
  
    //选中
    var index = parseInt(e.currentTarget.dataset.index);
    var goods_id = e.currentTarget.dataset.id;
    var carts = this.data.carts;
    var selected = this.data.carts[index].selected;
    carts[index].selected = !selected;
    //合计金额
    var goods_number = parseInt(carts[index].goods_number);
    var goods_price = parseFloat(carts[index].goods_price);
    var count = parseFloat(this.data.count) + goods_number*parseFloat(goods_price);
    var selectAll = false;
    var selectcount = this.data.selectcount;
    var selectedgood = this.data.selectedgood;
    // var selectedgood = this.data.selectedgood;
    
    if(!selected){
      selectedgood.push(goods_id);
     
      selectcount ++;
      wx.setStorageSync('selectedgood', selectedgood);
      this.toCalculate(count);
      this.setData({
        count: count,
        sum: goods_number + this.data.sum,
        selectcount: selectcount,
        // selectedgood: selectedgood
       });
    }else{
      for(let i = 0;i<selectedgood.length;i++){
        if(selectedgood[i] == goods_id){
          selectedgood.splice(i,1)
        }
        
      };
      selectcount --;
      wx.setStorageSync('selectedgood', selectedgood);
      count = this.data.count - goods_number*goods_price;
      this.toCalculate(count);
      this.setData({
        count: count,
        sum: this.data.sum - goods_number,
        selectcount: selectcount,
        selectedgood: selectedgood
      });
    }
  
    if (carts.length == selectcount) {
      selectAll = true
    }
    this.setData({
      carts: carts,
      selectAll: selectAll
    });

  },

  // 全选
  onSelectAll: function() {
    let carts = this.data.carts;
    var selectAll = !this.data.selectAll;
    let count = 0;
    let sum = 0;
    var selectedgood = [];
    var selectcount = 0;
    this.setData({
      selectAll: selectAll
    })
    if (this.data.selectAll) {
      // selectedgood = [];
     
      for (var i in carts) {
        let goods_id = carts[i].goods_id;
        carts[i].selected = true;
        count = count + parseFloat(carts[i].goods_price)*parseInt(carts[i].goods_number);
        this.toCalculate(count);
        sum = sum + parseInt(carts[i].goods_number);
        selectedgood.push(goods_id);
        selectcount++;
      }
     
      wx.setStorageSync('selectedgood', selectedgood);
      this.setData({
        carts: carts,
        count: count,
        sum: sum,
        selectedgood: selectedgood,
        selectcount: selectcount
      })
    } else {
      for (var i in carts) {        
        carts[i].selected = false,
        count = 0;
        sum = 0;
      }
      wx.setStorageSync('selectedgood', selectedgood);
    
      this.setData({
        carts: carts,
        count: count,
        discount: 0,
        sum: sum,
        selectedgood: selectedgood,
        selectcount: selectcount,
        isDiscount: false
      })
    }

  },

  /* 点击减号 */
  bindMinus: function(e) {
    let _this = this;

    var index = parseInt(e.currentTarget.dataset.index);
    var goods_id = e.currentTarget.dataset.id;
    var carts = _this.data.carts;
    var goods_number = _this.data.carts[index].goods_number;
    
    //是否在选中状态
    var selected = carts[index].selected;
    var goods_price = parseFloat(carts[index].goods_price);
    var count = _this.data.count - goods_price;
    if (selected) {
     
      if(_this.data.carts[index].goods_number != 1){
       
        this.toCalculate(count);
        _this.setData({
          // count: count,
          sum: _this.data.sum - 1,
        });
      }
    };
    // 如果大于1时，才可以减
    if (goods_number > 1) {
      goods_number --;
    
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = goods_number <= 1 ? 'disabled' : 'normal';
    
    carts[index].goods_number = goods_number;
    carts[index].minusStatuses = minusStatus;
   
    
   
    App._get('Cart/entropy', {"goods_id": goods_id,"operate": 3,"number": goods_number}, function(result) {
       // 将数值与状态写回
      _this.setData({
          carts: carts,
          // minusStatuses: minusStatuses
      });
    })
   
  },
  /* 点击加号 */
  bindPlus: function(e) {
    let _this = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var goods_id = e.currentTarget.dataset.id;
    var goods_number = _this.data.carts[index].goods_number;
    // 不作过多考虑自增1
    goods_number ++;
    var minusStatus = goods_number <= 1 ? 'disabled' : 'normal';
    var carts = _this.data.carts;
    carts[index].goods_number = goods_number;
    // var minusStatuses = this.data.minusStatuses;
    carts[index].minusStatuses = minusStatus;
    //是否在选中状态
    var selected = carts[index].selected;
    var goods_price = parseFloat(carts[index].goods_price);
    var count = _this.data.count + goods_price;
   
    if (selected) {
      this.toCalculate(count);
      _this.setData({
        count: count,
        sum: _this.data.sum + 1,
      });
    }
    App._get('Cart/entropy', {"goods_id": goods_id,"operate": 3,"number": goods_number}, function(result) {
       // 将数值与状态写回
      _this.setData({
          carts: carts,
          // minusStatuses: minusStatuses
      });
    })
    
  },
  /* 输入框事件 */
  bindManual: function(e) {
    let _this = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var goods_id = e.currentTarget.dataset.id;
    var goods_number = e.detail.value;
    if(goods_number >= 1 ){

      var minusStatus = goods_number <= 1 ? 'disabled' : 'normal';
      var carts = _this.data.carts;
      var prenum = carts[index].goods_number;
      carts[index].goods_number = goods_number;
      // var minusStatuses = this.data.minusStatuses;
      carts[index].minusStatuses = minusStatus;
      //是否在选中状态
      var selected = carts[index].selected;
      var price = parseFloat(carts[index].goods_price);
      var count = _this.data.count - prenum*price + goods_number*price;
    
      if (selected) {
        this.toCalculate(count);
        _this.setData({
          count: count,
          sum: parseInt(_this.data.sum) - parseInt(prenum) + parseInt(goods_number),
        });
      }
      App._get('Cart/entropy', {"goods_id": goods_id,"operate": 3,"number": goods_number}, function(result) {
        // 将数值与状态写回
      _this.setData({
          carts: carts,
          // minusStatuses: minusStatuses
      });
    })
      
    }else{
    
      return false 
    }
  },
   //显示优惠明细
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏优惠明细
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  //滑动删除
  touchstart: function (e) {
   //开始触摸时 重置所有删除
   this.data.carts.forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
     v.isTouchMove = false;
   }
   )
   this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    carts: this.data.carts
   })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
   that.data.carts.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
     if (touchMoveX > startX) //右滑
      v.isTouchMove = false
     else //左滑
      v.isTouchMove = true
    }
   })
   //更新数据
   that.setData({
    carts: that.data.carts
   })
  },
  angle: function (start, end) {
   var _X = end.X - start.X,
    _Y = end.Y - start.Y
   //返回角度 /Math.atan()返回数字的反正切值
   return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
 del: function (e) {
   
   let _this = this;
   var index = e.currentTarget.dataset.index;
   var goods_id = e.currentTarget.dataset.id;
   var selectedgood = this.data.selectedgood;
   var selectcount = this.data.selectcount;
   var carts = _this.data.carts;
   var goods_number = carts[index].goods_number;
   var price = parseFloat(carts[index].goods_price);
   //是否在选中状态
   var selected = carts[index].selected;
   var isBlank = true;
  App._post_form('Cart/deletecart', {'goods_id': goods_id}, result => {
    for(let i = 0;i<selectedgood.length;i++){
      if(selectedgood[i] == goods_id){
        selectedgood.splice(i,1);
        selectcount--;
      }
    }
    wx.setStorageSync('selectedgood', selectedgood);
    carts.splice(index, 1);
    if(carts.length == 0){
      isBlank = false;
    }
    var count = _this.data.count - goods_number*price;
   
    if (selected) {
      this.toCalculate(count);
      _this.setData({
        // count: count,
        sum: parseInt(_this.data.sum) - parseInt(goods_number),
      });
    }
    _this.setData({
      carts: carts,
      selectedgood: selectedgood,
      isBlank: isBlank,
      selectcount: selectcount
    })
  }, false, () => {
    wx.hideLoading();
  });
  
 },


 //计算总价
 toCalculate(count){
    let _this = this;
    App._get('Cart/total', {"count": count}, function(result) {
      // 将数值与状态写回
      var discount = result.data.discount;
      var reduce_price = result.data.reduce_price;
      if(reduce_price == 0){
        discount = discount.toFixed(2);
        reduce_price = reduce_price.toFixed(2);
      }
      var isDiscount = true;
      
     _this.setData({
      count: count,
      discount: discount,
      isDiscount: isDiscount,
      reduce_price: reduce_price
     });
   })
 },
 

 //跳转确认订单页面
  goOrder(){
 
    if(this.data.selectedgood.length > 0 ){
     
      wx.navigateTo({
        url: "/pages/order/index?order_type=cart&cart_ids="+this.data.selectedgood,
      })
    }
    
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {

  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    this.onRefrech()
   
    // 购物车请求数据
    let _this = this;
    _this.setData({
      isBlank: false
    })
    if(!App.checkIsLogin()){
      return false
    }
    App._get('Cart/index', {}, function(result) {
      var data = result.data;
      var carts = data.carts; //购物车的信息
      var sum = 0; //商品数量
      var count = 0;  //商品总价
      var selectedgood = [];
      var selectcount = 0;
      var isBlank = true;
      var coupon = data.coupon;  //优惠券的信息
      //提前写入data,让后面的_this.toCalculate()可以获取到coupon
      _this.setData({
        coupon: coupon
      })
      if(carts.length ==0){
        isBlank = false
      }
      if (wx.getStorageSync('selectedgood')){
        selectedgood = wx.getStorageSync('selectedgood');
        
        if(selectedgood.length == carts.length && selectedgood.length != 0){
          _this.setData({
            selectAll: true
         })
       }
       
      }
     
      for(let i=0;i<carts.length;i++){
        if(selectedgood){
          for(let j = 0;j<selectedgood.length;j++){
            if(selectedgood[j] == carts[i].goods_id){
             carts[i].selected = true;
             selectcount++;
            }
         }
        }
        
        carts[i].isTouchMove = false;
        // carts[i].selected = false;
        // 使用data数据对象设置样式名
        if(carts[i].goods_number>1){
          carts[i].minusStatuses = 'normal'
        }else{
          carts[i].minusStatuses = 'disabled'
        }
        if(carts[i].selected == true){
          sum = sum + carts[i].goods_number;
          count = count + carts[i].goods_number*parseFloat(carts[i].goods_price)
        }
      }
     
      _this.toCalculate(count);
     
      _this.setData({
        carts: carts,
        // coupon: coupon,
        selectedgood: selectedgood,
        selectcount: selectcount,
        sum: sum,
        count: count,
        isBlank: isBlank
      })
    }
    );
    // 设置tabbar的选中状态，要在每个tab页面的onShow中设置
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 2
      })
    }
  },
  //  事件函数--监听页面数据刷新
  onRefrech: function(e) {
   
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
    path: 'pages/cart/index' // 分享路径
    }
  }

})