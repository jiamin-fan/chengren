// pages/evaluation/add.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentInp: "",
    order_id:"",
    res: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //修改title
    wx.setNavigationBarTitle({
      title: '发表评价'
    });

    // 请求数据
    let _this = this;
    App._post_form('comment/detail', {order_id: options.order_id}, result => {
      var data = result.data;
      var order_id = data.res.order_id;
      var res = data.res;
      // console.log(res);
     _this.setData({
       order_id: order_id,
       res: res,
     });
    }, false, () => {
      wx.hideLoading();
    });
  },
  
//获取用户的输入信息，输入的内容
contentInp:function(e) {

  this.setData({
    contentInp: e.detail.value
  });
  console.log(e.detail.value)
},

//  /**发表评论 */
//  addComment() {
//   let params = {
//     pID: this.data.wantID,
//     userID: app.globalData.userID,
//     content: this.data.contentInp,
//     replyUserID: this.data.userID,
//     type: 1,
//     state: true
//   }
//   app.addReply(params).then(res => {
//     if (res.state === 1) {
//       this.setData({
//         contentInp: ""
//       })
//       wx.showToast({
//         title: '评论成功',
//         icon: "none",
//         duration: 1000,
//         mask: true,
//       })
//       this.getWantDetail();
//     }
//   })
// },
add_content: function () {
  // 请求数据
  let _this = this;
  App._post_form('comment/add', {order_id:_this.data.order_id,content:_this.data.contentInp}, result => {
    //存一个
    wx.setStorageSync("numData","111");
    wx.navigateBack({
      delta: 1,
    })
  }, false, () => {
    wx.hideLoading();
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})