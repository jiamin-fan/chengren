let App = getApp();
// 富文本插件
const wxParse = require("../../wxParse/wxParse.js");

Page({
  data: {
    // 顶部导航栏
    tabcurrent: 'tab1',
    tabIsTop: true,
    scrollTop: 250,
    selectedTab: 1,

    btnClicked: true, //让点击事件同步操作
    goods: [],
    goods_id: '',
    detail: [], // 商品详情信息
    // isScroll: true,
    // tab切换
    isSharePic: false,
    shareurl: '',
    localpath: '',
    currentTab: 0,
    isLike: true,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    isCompeted: false,
    store_name: '某某店铺',

    // 商品评价
    com_userInfo: [{
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/1.jpg',
      name: '张*',
      number: 136 + '***' + 57,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/2.jpg',
      name: '李*',
      number: 189 + '***' + 46,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/3.jpg',
      name: '黄*',
      number: 178 + '***' + 21,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/1.jpg',
      name: '陈*',
      number: 177 + '***' + 35,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/6.jpg',
      name: '梁*',
      number: 163 + '***' + 15,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/7.jpg',
      name: '刘*',
      number: 131 + '***' + 40,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/8.jpg',
      name: '张*',
      number: 170 + '***' + 15,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/9.jpg',
      name: '蔡*',
      number: 182 + '***' + 59,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/10.jpg',
      name: '林*',
      number: 147 + '***' + 23,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/11.jpg',
      name: '唐*',
      number: 151 + '***' + 44,
      comment: '好评'
    }, {
      headImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/12.jpg',
      name: '李*',
      number: 191 + '***' + 67,
      comment: '好评'
    }],
    com_vertical: true,
    com_autoplay: true,
    com_interval: 2000,
    com_duration: 500,

    // 进店逛逛
    storeImg: 'https://afjm.oss-cn-shenzhen.aliyuncs.com/head/5.png',

    // 商品详情介绍
    detailImg: [
      'https://e41.oss-cn-beijing.aliyuncs.com/images/img_08.jpg',
      "https://e41.oss-cn-beijing.aliyuncs.com/images/img_08.jpg",
      "https://e41.oss-cn-beijing.aliyuncs.com/images/img_08.jpg",
      "https://e41.oss-cn-beijing.aliyuncs.com/images/img_08.jpg",
      "https://e41.oss-cn-beijing.aliyuncs.com/images/img_08.jpg",
      "https://e41.oss-cn-beijing.aliyuncs.com/images/img_08.jpg",
    ],
    item: {},
    hidepopup: true,
    num: 9,
    cart: [],
    isShare: "",
  },


  onLoad: function (options) {
    // this.getStore()
    // 分享给好友
    wx.showShareMenu({
      withShareTicket: true
    });
    // this.onUpdateCart()
  
    var pages=getCurrentPages();
    var currentPage=pages[pages.length-1];
    var can=currentPage.options;
    var strid=can.str;
    var goodid=0;
    if(strid==''||strid==0||strid==undefined){
        goodid=options.goods_id;
    }else{
        goodid=strid;
    }
    // 请求数据
    let _this = this;
    App._get('Goods/index', {
      // goods_id: options.goods_id
      goods_id: goodid
    }, function (result) {
      var data = _this._initGoodsDetailData(result.data);
      var goods = data.goods;
      console.log(goods)
      _this.setData({
        goods: goods,
        detail: data
      })
    });
  },
  // 顶部导航栏
  tabChange(event) {
    var _this = this;
    console.log(event)
    var key = event.detail.key;
    _this.setData({
      tabcurrent: key,
    })
    wx.pageScrollTo({
      duration: 0,
      selector: '#' + key
    })
  },

  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    // console.log(wx.getSystemInfoSync().windowHeight)  //可用的窗口高度
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      // 滚动到最顶部
      ev.scrollTop = 0;
      _this.setData({
        tabIsTop: true
      });
    }

    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > 80) {
      //向下滚动
      _this.setData({
        tabIsTop: false
      });
    } else if (ev.scrollTop < 80) {
      //向上滚动
      _this.setData({
        tabIsTop: true,
        tabcurrent: 'tab1'
      });
    }

    // 导航栏当前项
    if (ev.scrollTop > 460 && ev.scrollTop < 650) {
      _this.setData({
        tabcurrent: 'tab2'
      });
    }
    if (ev.scrollTop > 650) {
      _this.setData({
        tabcurrent: 'tab3'
      });
    }

    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  },

  // 获取店铺名
  // getStore: function () {
  //   App._post_form('Storeinfo/destore', {}, result => {
  //     var store_name = result.data.data
  //     this.setData({
  //       store_name: store_name
  //     })
  //   })
  // },

  /**
   * 初始化商品详情数据
   */
  _initGoodsDetailData(data) {

    let _this = this;
    // 商品详情
    let goodsDetail = data.goods;
    
    data.goods_price = goodsDetail.goods_price;
    return data;
  },

  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },
  //首页跳转
  addIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 购物车跳转
  addLike: function () {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
  // 加入购物车
  onAddCart() {
    let _this = this;
    _this.setData({
      btnClicked: false
    })
    App._post_form('Cart/entropy', {
      goods_id: _this.data.goods.goods_id,
      operate: 1,
      number: 1
    }, result => {
      var code = result.code;
      if (code == 1) {
        if (result.data.data == "商品库存不足") {
          wx.showToast({
            title: '商品库存不足',
            icon: 'error',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '加购成功！',
            icon: 'success',
            duration: 2000
          });
        }
      } else {
        wx.showToast({
          title: '加购失败！',
          icon: 'failed',
          duration: 2000
        });
      }
    }, false, () => {
      setTimeout(
        () => {
          _this.setData({
            btnClicked: true
          })
        }, 2000
      )
    });
  },

  // 立即购买
  immeBuy() {
    wx.navigateTo({
      url: '/pages/order/index?order_type=buyNow&goods_id=' + this.data.goods.goods_id + '&goods_num=1&goods_sku_id=0',
    })
  },
  // 选项卡：
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    })
  },

  //关闭分享弹窗
  closeBg: function () {
    this.setData({
      isShare: false,
      // isScroll: true
    })
  },
  // 分享的弹框
  goShare: function (e) {
    this.setData({
      isShare: true,
    })
  },
  cancelShare: function (e) {
    this.setData({
      isShare: false,
    });

  },

  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: this.data.goods.goods_name,

        })
      }, 2000)
    })
    return {
      title: this.data.goods.goods_name,
      path: '/pages/share/index?goods_id=' + this.data.goods.goods_id,
      promise
    }
  },

  // 保存图片
  getPhotos: function () {
    let _this = this;
    if (!App.checkIsLogin()) {
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 2000
      });
      return false;
    }
    
    App._post_form('poster/index', {
      'goods_id': this.data.goods.goods_id,
      'path': 'pages/good/index?goods_id=' + this.data.goods.goods_id
    }, result => {
      //将网络路径转化为本地路劲或临时路径
      wx.getImageInfo({
        src: result.data.url,
        success(res) {
          _this.setData({
            localpath: res.path,
          })
          setTimeout(
            () => {
              _this.setData({
                isCompeted: true

              })
            }, 1000
          )
        }
      })
      _this.setData({
        shareurl: result.data.url,
        isSharePic: true

      })

    }, false, () => {
      wx.hideLoading();

    });
  },
  //获取手机相册权限
  getPhotosAlbumAuth() {
    console.log('1');
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.saveImage();
            }
          })
        } else {
          this.saveImage();
        }
      }
    })
   
  },
  //保存海报
  saveImage() {
   
    wx.saveImageToPhotosAlbum({
      filePath: this.data.localpath,
      success: (data) => {
        wx.showToast({
          title: "图片保存成功",
          icon: "success",
          mask: true
        })
      },
      fail: () => {
        wx.showToast({
          title: "图片保存失败",
          icon: "error",
          mask: true
        })
      },
      complete: () => {
        
      }
    })
  },


  onReady: function () {

    // 生命周期函数--监听页面初次渲染完成

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
  },

  onLogin() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '更好的服务', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (e) => {
        let _this = this;
        App.getUserInfo(e, () => {
          wx.setStorageSync('userInfo', e.userInfo);
          //  console.log(e.userInfo);
          _this.setData({
            isLogin: true
          })
        });
      }
    })
  },

  onHide: function () {

    // 生命周期函数--监听页面隐藏

  },

  onUnload: function () {

    // 生命周期函数--监听页面卸载

  },

  onPullDownRefresh: function () {

    // 页面相关事件处理函数--监听用户下拉动作

  },

  onReachBottom: function () {

    // 页面上拉触底事件的处理函数

  },

  
})