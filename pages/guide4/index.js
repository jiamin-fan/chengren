// pages/guide1/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
    hasimageUrl: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    options.link = options.link?options.link:'';
    if(options.link != ''){
      options.link = decodeURIComponent(options.link)
    }
    this.data.options = options;
    this.getUrl();
  },

  getUrl: function() {
    let that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://novel.xundn.cn/api.php/promote/gongzhonghao?id=4',
      data: {
        link: that.data.options.link
      },
      method: 'POST',
      success: function (result) {
        if(result.data.code == 0){
          that.setData({
            imageUrl: result.data.data.url,
            hasimageUrl: true
          })
        }
      },
      fail(res) {
        
      },
      complete(res) {
        wx.hideNavigationBarLoading();
      },
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
    wx.hideHomeButton({
      success: (res) => {},
    });
  },

  /** 
	 * 预览图片
	 */
	previewImage: function (e) {  
		var current=e.target.dataset.src;
		wx.previewImage({
		  	current: current, // 当前显示图片的http链接
        urls: [this.data.imageUrl], // 需要预览的图片http链接列表
        showmenu: true
		})
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