// pages/order/index.js

var App = getApp();

Page({
  data: {
    type: '',
    isShow: true,
    sum: 0, //合计
    total_sum: 0,   //使用优惠券后
    remark:'',
    coupons: [],
    user_address: [],
    goodsInfos: [],
    isDiscount: false,
    u_coupons: [],
    goods_num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled' 
  },


  address:function(){
    wx.navigateTo({
      url: '/pages/address/index?from=flow',
    })
  },

 
  /* 点击减号 */  
  bindMinus: function() {  
      var goods_num = this.data.goods_num;  
      var sum = this.data.sum;
      var total_sum = this.data.total_sum;
      // 如果大于1时，才可以减  
      if (goods_num > 1) {  
        goods_num --;  
      }  
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = goods_num <= 1 ? 'disabled' : 'normal';
      sum = sum - parseFloat(this.data.goodsInfos[0].goods_price);
      total_sum = total_sum - parseFloat(this.data.goodsInfos[0].goods_price);
      // 将数值与状态写回  
      this.setData({  
        goods_num: goods_num,  
        minusStatus: minusStatus,
        sum: sum,
        total_sum: total_sum 
      });  
  },  
  /* 点击加号 */  
  bindPlus: function() {  
      var goods_num = this.data.goods_num;  
      var sum = this.data.sum;
      var total_sum = this.data.total_sum;
      console.log(goods_num);
      // 不作过多考虑自增1  
      goods_num ++;  
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = goods_num < 1 ? 'disabled' : 'normal';  
      sum = sum + parseFloat(this.data.goodsInfos[0].goods_price);
      total_sum = total_sum + parseFloat(this.data.goodsInfos[0].goods_price);
      // 将数值与状态写回  
      this.setData({  
        goods_num: goods_num,  
        minusStatus: minusStatus,
        sum: sum,
        total_sum: total_sum   
      });  
  },  
  /* 输入框事件 */  
  bindManual: function(e) {  
      var goods_num = e.detail.value; 
      var prenum = this.data.goods_num;
      var goods_price =  parseFloat(this.data.goodsInfos[0].goods_price);
      var sum = this.data.sum;
      var total_sum = this.data.total_sum;
      var minusStatus = goods_num < 1 ? 'disabled' : 'normal';  
      sum = sum - prenum*goods_price + goods_num*goods_price;
      total_sum = total_sum - prenum*goods_price + goods_num*goods_price;
      // 将数值与状态写回  
      this.setData({  
        goods_num: goods_num,
        minusStatus: minusStatus,
        sum: sum,
        total_sum: total_sum      
      });  
  },

  //选择优惠券
  showDetail: function(){

  },

  onLoad: function (options) {
    var type = options.type;
    this.setData({
      type: type
   })
  },
  onShow: function (options){
    
    let _this = this;
    //判断是否显示购买数量
    if(_this.data.type == 0){
      //从购物车进来
      App._get('Order/index', {}, function(result) {
        var data = result.data;
        var goodsInfos = data.goodsInfos;
        var user_address = data.user_address;
        var goods_num = data.goods_num;
        var u_coupons = data.u_coupons;
        if(u_coupons){
          var isDiscount = true;
        }
        _this.setData({
          goodsInfos: goodsInfos,
          user_address: user_address,
          sum: parseFloat(data.sum),
          total_sum: data.total_sum,
          goods_num: goods_num,
          u_coupons: u_coupons,
          isDiscount: isDiscount,
          isShow: false,
          // type: type
        })
      });

    }else{
      //直接购买
      App._get('Order/good_buy', {"good_id": options.goods_id}, function(result) {
        var data = result.data;
        var goodsInfos = data.goodsInfos;
        var user_address = data.user_address;
        var u_coupons = data.u_coupons;
        _this.setData({
          goodsInfos: goodsInfos,
          user_address: user_address,
          sum: parseFloat(data.sum),
          total_sum: data.total_sum,
          u_coupons: u_coupons,
          isShow: true,
          // type: type
        })
      });

    } 
   
    

  },
  //  事件函数--监听页面数据刷新
  onRefrech: function(e) {
   
  }

})