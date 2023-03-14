const App = getApp();

// 工具类
import Util from '../../utils/util.js';
const util = require('../../utils/util.js');

// 验证类
import Verify from '../../utils/verify.js';

// 枚举类：发货方式
import DeliveryTypeEnum from '../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType';

// 对话框插件
import Dialog from '../../components/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    phonenum: '13172802222',
    // 当前页面参数
    options: {},
    b_time: "",
    details: "",
    km: "",
    store_name: "",
    lat: "",
    lng: "",
    store_id: '',

    // // 系统设置：配送方式
    // deliverySetting: [],

    // 系统设置
    setting: {
      delivery: [], // 支持的配送方式
    },

    // 配送方式
    isShowTab: false,
    DeliveryTypeEnum,
    curDelivery: null,

    // 支付方式
    PayTypeEnum,
    curPayType: PayTypeEnum.WECHAT.value,

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址

    selectedShopId: 0, // 选择的自提门店id
    linkman: '', // 自提联系人
    phone: '', // 自提联系电话

    // 商品信息
    goods: {},

    // 选择的优惠券
    selectCouponId: 0,

    // 是否使用积分抵扣
    isUsePoints: false,

    // 买家留言
    remark: '',

    // 禁用submit按钮
    disabled: false,

    hasError: false,
    error: '',
  },



  // 切换自提跟快送
  changeOil: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    this.setData({
      num: e.target.dataset.num
    })
  },
  // 点击复制手机号码
  copyPhone: function (e) {
    var that = this
    wx.setClipboardData({
      data: that.data.phonenum,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '号码已复制'
            })
          }
        })
      }
    })
  },
  // 选择送达时间
  bindTimeChange: function (e) {
    //设置事件
    this.setData({
      //给当前time进行赋值
      time: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // _this.getStoreDetail()
    // options.goods_num = 1;
    // options.goods_sku_id = 0;
    // options.order_type = 'buyNow';
    // options.order_type = 'cart';
    // options.cart_ids = '4,6'
    // 当前页面参数
    _this.setData({
      options,
    });
    // console.log(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取当前订单信息
    _this.getOrderData();
    // console.log(_this.data)
  },

  /**
   * 获取门店信息
   */
  // getStoreDetail: function () {
    
  //   App._post_form('Storeinfo/orderstore', {}, result => {
  //     console.log(result)
  //     var b_time = result.data.data.b_time;
  //     var details = result.data.data.details;
  //     var km = result.data.data.km;
  //     var store_name = result.data.data.store_name;
  //     var lat = result.data.data.lat;
  //     var lng = result.data.data.lng;
  //     var store_id = result.data.data.store_id;
  //     var phonenum = result.data.data.store_ph
  //     this.setData({
  //       b_time: b_time,
  //       details: details,
  //       km: km,
  //       store_name: store_name,
  //       store_id: store_id,
  //       lat: lat,
  //       lng: lng,
  //       phonenum: phonenum
  //     })

  //   })


  // },

  // 打开地图导航
  seeMap: function (e) {
    // console.log(e)
    var latitude = e.currentTarget.dataset.lat
    var longitude = e.currentTarget.dataset.lng
    var name = e.currentTarget.dataset.name
    var details = e.currentTarget.dataset.details
    wx.getLocation({
      type: 'wgs84',
      // type: 'gcj02',
      success: function (res) {
        console.log('打开地图导航去目的地');
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: parseFloat(latitude), //要去的纬度-地址
          longitude: parseFloat(longitude), //要去的经度-地址
          name: name,
          address: details,
        })
      }
    })
  },

  // 拨号
  freeTell: function (e) {
    console.log(e)
    let phonenum = e.currentTarget.dataset.phonenum;
    wx.makePhoneCall({
      phoneNumber: phonenum
    })
  },

 

  /**
   * 获取当前订单信息
   */
  getOrderData() {
    let _this = this,
      options = _this.data.options;
    // 获取订单信息回调方法
    let callback = result => {
      let resData = result.data;
      console.log(resData.delivery)
      // 请求错误
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (resData.has_error) {
        _this.data.hasError = true;
        _this.data.error = resData.error_msg;
        App.showError(_this.data.error);
      }

      let data = {};
      // 当前选择的配送方式
      data.curDelivery = resData.delivery;
      // 如果只有一种配送方式则不显示选项卡
      // data.isShowTab = resData.setting.delivery.length > 1;
      // return false;
      // 上门自提联系信息
      // if (_this.data.linkman === '') {
      //   data.linkman = resData.last_extract.linkman;
      // }
      // if (_this.data.phone === '') {
      //   data.phone = resData.last_extract.phone;
      // }
      // 设置页面数据
      _this.setData(Object.assign({}, resData, data));
      wx.hideLoading();
    };

    wx.showLoading({
      title: '加载中...',
    });

    // 请求的参数
    let params = {
      delivery: _this.data.curDelivery || 0,
      shop_id: _this.data.selectedShopId || 0,
      coupon_id: _this.data.selectCouponId || 0,
      is_use_points: _this.data.isUsePoints ? 1 : 0,
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      
      App._get('orders/buyNow', Object.assign({}, params, {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
      }), result => {
        // console.log(result);return false;
        callback(result);
      });
    }

    // 砍价活动结算
    else if (options.order_type === 'bargain') {
      App._get('bargain.order/checkout', Object.assign({}, params, {
        task_id: options.task_id,
        goods_sku_id: options.goods_sku_id,
      }), result => {
        callback(result);
      });
    }

    // 秒杀活动结算
    else if (options.order_type === 'sharp') {
      App._get('sharp.order/checkout', Object.assign({}, params, {
        active_time_id: options.active_time_id,
        sharp_goods_id: options.sharp_goods_id,
        goods_sku_id: options.goods_sku_id,
        goods_num: options.goods_num,
      }), result => {
        callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('orders/cart', Object.assign({}, params, {
        cart_ids: options.cart_ids || 0,
      }), result => {
        callback(result);
      });
    }
  },

  /**
   * 切换配送方式
   */
  onSwichDelivery(e) {
    // 设置当前配送方式
    let _this = this,
      curDelivery = e.currentTarget.dataset.current;
    _this.setData({
      curDelivery
    });
    // 重新获取订单信息
    _this.getOrderData();
  },

  /**
   * 快递配送：选择收货地址
   */
  onSelectAddress() {
    wx.navigateTo({
      url: '../address/' + (this.data.exist_address ? 'index?from=flow' : 'create')
    });
  },

  /**
   * 上门自提：选择自提点
   */
  onSelectExtractPoint() {
    let _this = this,
      selectedId = _this.data.selectedShopId;
    wx.navigateTo({
      url: '../_select/extract_point/index?selected_id=' + selectedId
    });
  },

  /**
   * 跳转到商品详情页
   */
  onTargetGoods(e) {
    // wx.navigateTo({
    //   url: `../good/index?goods_id=${e.currentTarget.dataset.id}`,
    // })
  },

  /**
   * 订单提交
   */
  onSubmitOrder() {
    let _this = this,
      options = _this.data.options;
    // App.requestSubscribeMessage(["xzmc8UwNipyaLj_-atGI_XVcDmM_CuXWL855zn-HvHU","xaYd9vgv_wYMeESKGyNe95v_kgBak_Ebsp5UJOFillA"], function() {
    if (_this.data.disabled) {
      return false;
    }

    // 表单验证
    if (!_this._onVerify()) {
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = result => {
      if (result.code === -10) {
        App.showError(result.msg, () => {
          _this.redirectToOrderIndex();
        });
        return false;
      }

      // 发起微信支付
      if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
        App.wxPayment({
          payment: result.data.payment,
          success: res => {
            _this.redirectToOrderIndex();
          },
          fail: res => {
            App.showError(result.msg.error, () => {
              _this.redirectToOrderIndex();
            });
          },
        });
      }
      // 余额支付
      if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
        App.showSuccess(result.msg.success, () => {
          _this.redirectToOrderIndex();
        });
      }
    };

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });


    let url = '';

    // 表单提交的数据
    let postData = {
      delivery: _this.data.curDelivery, // 配送方式
      pay_type: _this.data.curPayType, // 支付方式
      shop_id: _this.data.selectedShopId || 0, // 自提门店id
      linkman: _this.data.linkman, // 自提联系方式-姓名
      phone: _this.data.phone, // 自提联系方式-手机号
      coupon_id: _this.data.selectCouponId || 0, // 优惠券id
      is_use_points: _this.data.isUsePoints ? 1 : 0, // 积分抵扣
      remark: _this.data.remark || '', // 买家留言
    };

    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      url = 'orders/buyNow';
      postData = Object.assign(postData, {
        goods_id: options.goods_id, // 商品id
        goods_num: options.goods_num, // 商品数量
        goods_sku_id: options.goods_sku_id, // 商品规格id
      });
    }

    console.log(postData);

    // 创建订单-购物车结算
    if (options.order_type === 'cart') {
      url = 'orders/cart';
      postData = Object.assign(postData, {
        cart_ids: options.cart_ids || 0,
      });
    }

    // 创建订单-砍价活动
    if (options.order_type === 'bargain') {
      url = 'bargain.order/checkout';
      postData = Object.assign(postData, {
        task_id: options.task_id,
        goods_sku_id: options.goods_sku_id,
      });
    }

    // 创建订单-砍价活动
    if (options.order_type === 'sharp') {
      url = 'sharp.order/checkout';
      postData = Object.assign(postData, {
        active_time_id: options.active_time_id,
        sharp_goods_id: options.sharp_goods_id,
        goods_sku_id: options.goods_sku_id,
        goods_num: options.goods_num,
      });
    }

    // 订单提交
    App._post_form(url, postData, result => {
      // console.log(result);return false;
      callback(result);
    }, result => {}, () => {
      wx.hideLoading();
      // 解除按钮禁用
      _this.data.disabled = false;
    });
    // })
  },

  /**
   * 表单验证
   */
  _onVerify() {
    let _this = this;
    // if (_this.data.hasError) {
    //   App.showError(_this.data.error);
    //   return false;
    // }
    // 验证自提填写的联系方式
    if (_this.data.curDelivery == DeliveryTypeEnum.EXTRACT.value) {
      _this.setData({
        linkman: _this.data.linkman.trim(),
        phone: _this.data.phone.trim(),
      });
      if (_this.data.selectedShopId <= 0) {
        App.showError('请选择自提的门店');
        return false;
      }
      if (Verify.isEmpty(_this.data.linkman)) {
        App.showError('请填写自提联系人');
        return false;
      }
      if (Verify.isEmpty(_this.data.phone)) {
        App.showError('请填写自提联系电话');
        return false;
      }
      if (!Verify.isPhone(_this.data.phone)) {
        App.showError('请输入正确的联系电话');
        return false;
      }
    }
    return true;
  },

  /**
   * 买家留言
   */
  bindRemark(e) {
    let _this = this;
    _this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 选择优惠券(弹出/隐藏)
   */
  onTogglePopupCoupon() {
    let _this = this;
    if (_this.data.coupon_list.length > 0) {
      _this.setData({
        showBottomPopup: !_this.data.showBottomPopup
      });
    }
  },

  /**
   * 选择优惠券
   */
  onSelectCoupon(e) {
    let _this = this;
    // 记录选中的优惠券id
    _this.setData({
      selectCouponId: e.currentTarget.dataset.id
    });
    // 重新获取订单信息
    _this.getOrderData();
    // 隐藏优惠券弹层
    _this.onTogglePopupCoupon();
  },

  /**
   * 不使用优惠券
   */
  onNotUseCoupon() {
    let _this = this;
    _this.setData({
      selectCouponId: 0
    });
    // 重新获取订单信息
    _this.getOrderData();
    // 隐藏优惠券弹层
    _this.onTogglePopupCoupon();
  },

  /**
   * 选择支付方式
   */
  onSelectPayType(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 设置当前支付方式
    _this.setData({
      curPayType: e.currentTarget.dataset.value
    });
  },

  /**
   * 跳转到未付款订单
   */
  redirectToOrderIndex() {
    wx.redirectTo({
      url: '/pages/order-lists/index',
    });
  },

  /**
   * input绑定：联系人
   */
  onInputLinkman(e) {
    let _this = this;
    _this.setData({
      linkman: e.detail.value
    });
  },

  /**
   * input绑定：联系电话
   */
  onInputPhone(e) {
    let _this = this;
    _this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 选择积分抵扣
   */
  onTriggerPoints({
    detail
  }) {
    let _this = this;
    _this.setData({
      isUsePoints: detail
    });
    // 重新获取订单信息
    _this.getOrderData();
  },

  /**
   * 显示积分说明
   */
  onShowPoints(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 显示dialog
    let setting = _this.data.setting;
    Dialog({
      title: `${setting.points_name}说明`,
      message: setting.points_describe,
      selector: '#zan-base-dialog',
      isScroll: true, // 滚动
      buttons: [{
        text: '关闭',
        color: 'red',
        type: 'cash'
      }]
    });
  },

  /**
   * 增加商品数量
   */
  onIncGoodsNumber(e) {
    let _this = this;
    _this.setData({
      goods_num: ++_this.data.options.goods_num
    });
    _this.getOrderData();
  },

  /**
   * 减少商品数量
   */
  onDecGoodsNumber(e) {
    let _this = this;
    // App.saveFormId(e.detail.formId);
    if (_this.data.goods_num > 1) {
      _this.setData({
        goods_num: --_this.data.options.goods_num
      });
      _this.getOrderData();
    }
  },

  /**
   * 自定义输入商品数量
   */
  onInputGoodsNum(e) {
    let _this = this,
      iptValue = e.detail.value;
    if (!_this.isPositiveInteger(iptValue) && iptValue !== '') {
      iptValue = 1;
    }
    if (iptValue == '' || iptValue < 1) {
      iptValue = 1;
    }
    // _this.setData({
    //   goods_num: iptValue
    // });
    _this.data.options.goods_num = iptValue
    // console.log(_this.data.options.goods_num);return false;
    _this.getOrderData();
  },

  /**
   * 判断是否为正整数
   */
  isPositiveInteger(value) {
    return /(^[0-9]\d*$)/.test(value);
  }

});