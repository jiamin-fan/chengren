// pages/demo/index.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    phoneNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      phoneNumber: options.phone
    })
  },
  
  /**
   * 表单提交
   */
  saveData: function(e) {
    // console.log(e);return false;
    let _this = this,
      values = e.detail.value;

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    // console.log(values);return false;
    // 提交到后端
    App._post_form('user/phone_edit', values, function(result) {
      App.showSuccess('保存成功', function() {
        // wx.navigateBack();
        wx.navigateBack({
          delta: 1,
        })
      });
    }, false, function() {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.phoneNumber.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phoneNumber.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    if (!reg.test(values.phoneNumber)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (values.phoneNumber == this.data.phoneNumber) {
      this.data.error = '手机号没有做出更改';
      return false;
    }
    return true;
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