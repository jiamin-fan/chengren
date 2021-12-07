let App = getApp();
// 富文本插件
const wxParse = require("../../wxParse/wxParse.js");

Page({
  data: {
    btnClicked:true, //让点击事件同步操作
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
    isCompeted:false,

    // 商品详情介绍
    detailImg: [
      "../../images/lun1.jpg",
      "../../images/lun2.jpg",
      "../../images/lun3.jpg",
      "../../images/lun4.jpg",
      "../../images/lun5.jpg",
      "../../images/lun6.jpg",
    ],
    item: {},
    hidepopup: true,
    num: 9,
    cart: [],
    isShare:"",
  },


  onLoad: function (options) {
    // 分享给好友
    wx.showShareMenu({
      withShareTicket: true
    });
    // this.onUpdateCart()

     // 请求数据
     let _this = this;
     App._get('Goods/index', {goods_id: options.goods_id}, function(result) {
       var data = _this._initGoodsDetailData(result.data);
       var goods = data.goods;
      //  console.log(goods);
      _this.setData({
        goods: goods,
        // goods_id: options.goods_id,
        detail: data
      })
     });
  },
    /**
   * 初始化商品详情数据
   */
  _initGoodsDetailData(data) {
    console.log(1234);
    let _this = this;
    // 商品详情
    let goodsDetail = data.goods;
    // 富文本转码
    if (goodsDetail.goods_content.length > 0) {
      wxParse.wxParse('content', 'html', goodsDetail.goods_content, _this, 0);
    }
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
  // 加入购物车
  onAddCart() {
    let _this = this;
    _this.setData({
      btnClicked: false
    })
    console.log(_this.data.goods.goods_id);
      App._post_form('Cart/entropy', {goods_id: _this.data.goods.goods_id,operate: 1,number: 1}, result => {
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

   // 立即购买
   immeBuy() {
    wx.navigateTo({
      url: '/pages/order/index?order_type=buyNow&goods_id='+this.data.goods.goods_id+'&goods_num=1&goods_sku_id=0',
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
    console.log(e);
    this.setData({
    currentTab: e.detail.current,
    })
  },

  //关闭分享弹窗
  closeBg:function(){
    this.setData({
      isShare: false,
      // isScroll: true
    })
    
  },
  // 分享的弹框
  goShare: function(e){
    this.setData({
      isShare: true,
      // isScroll: false
    })
  },
  cancelShare: function(e){
    this.setData({
      isShare: false,
    });
   
  },

  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: this.data.goods.goods_name,
          // imageUrl: '../../images/icon/share.png'
        })
      }, 2000)
    })
    return {
      title: this.data.goods.goods_name,
      path: '/pages/share/index?goods_id='+this.data.goods.goods_id,
      promise 
    }
    // wx.showToast({
    //   title: '分享成功',
    //   icon: 'success',
    //   duration: 2000
    // });
  },

  // 保存图片
  getPhotos:function(){
    let _this = this;
    if(!App.checkIsLogin()){
      wx.showToast({
        title: '请先登录',
        icon: 'error',
        duration: 2000
      });
      return false;
    }
    App._post_form('poster/index', {'goods_id': this.data.goods.goods_id,'path':'pages/good/index?goods_id='+this.data.goods.goods_id}, result => {
      //将网络路径转化为本地路劲或临时路径
      wx.getImageInfo({
        src: result.data.url,
        success (res) {
          _this.setData({
            localpath: res.path,
          })   
          setTimeout(
            ()=>{_this.setData({
              isCompeted:true
              
            })},1000
          )
        }
      })
      _this.setData({
        shareurl: result.data.url,
        isSharePic: true
        
      })
      console.log(123);
    }, false, () => {
      wx.hideLoading();
      
    });
  },
   //获取手机相册权限
   getPhotosAlbumAuth(){
    wx.getSetting({
      success:(res)=> {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success:()=> {
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
  saveImage(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.localpath,
      success: (data)=> {
        wx.showToast({
          title: "图片保存成功",
          icon: "success",
          mask: true
        })
      },
      fail:()=>{
        wx.showToast({
          title: "图片保存失败",
          icon: "error",
          mask: true
        })
      },
      complete: () => {
        //this.posterStatus=false;
      }
    })
  },

  //事件函数--监听加入购物车事件
  // onAddCart: function() {
  //   wx.getStorage({
  //     key: 'cart',
  //     success: res => {
  //       //本地内存里有cart数据的处理逻辑
  //       let isexist = false
  //       // 如果该商品已存在于cart里，则仅改变数量
  //       for (var i in res.data) {
  //         if (this.data.item.id == res.data[i].id) {
  //           isexist = true
  //           res.data[i].total += this.data.num
  //         }
  //       }
  //       //如果该商品不存在于cart里，则新增商品
  //       if (!isexist) {
  //         let cartitem = this.data.item
  //         cartitem['total'] = this.data.num
  //         res.data.push(this.data.item)
  //       }
  //       // 把更新后的cart存入本地内存
  //       wx.setStorage({
  //         data: res.data,
  //         key: 'cart',
  //       })
  //       this.onUpdateCart()
  //       wx.showToast({
  //         title: '加入购物车成功！',
  //       })
  //     },
  //     fail: err => {
  //       //本地内存里没有cart数据的处理逻辑
  //       let cartitem = this.data.item
  //       cartitem['total'] = this.data.num
  //       let cart = []
  //       cart.push(cartitem)
  //       wx.setStorage({
  //         data: cart,
  //         key: 'cart',
  //       })
  //       this.onUpdateCart()
  //       wx.showToast({
  //         title: '加入购物车成功！',
  //       })
  //     }
  //   })
  // },

  //事件函数--监听购物车数据更新后的页面展示变化
  // onUpdateCart: function() {
  //   wx.getStorage({
  //     key: 'cart',
  //     success: res => {
  //       this.setData({
  //         cart: res.data,
  //         num: 1
  //       })
  //     }
  //   })
  // },
  
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
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
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

  // onShareAppMessage: function () {
  // // 用户点击右上角分享
  // return {
  // title: 'title', // 分享标题
  // desc: 'desc', // 分享描述
  // path: 'path' // 分享路径
  // }
  // }

  /**
 * 用户点击右上角分享
 */
//   onShareAppMessage: function () {
//     return {
//       title: '限时特卖：'+this.name,
//       path: 'pages/index/index?data=这边可以传一些ID啥的',
//       imageUrl: this.picTempUrl
//     }
//   },




})