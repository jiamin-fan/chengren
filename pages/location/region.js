// pages/location/region.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '广东省',
    city: '广州市'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      wx.request({
        url: app.globalData.url +'index/ajax/province',
        data: { current:0,from:'xcx'},
        method: 'post',
        header: { 'Content-Type': 'application/json' },
        success:function(res2){
          that.setData({
            region: res2.data
          });
          const provinces = [[],[]];
          const citys = [[],[]];
          const countys = [];
          
          for (let i = 0; i < that.data.region.length; i++) {
            var obj = new Object;
            obj.itemid = that.data.region[i].itemid;
            obj.name = that.data.region[i].name
            provinces[0].push(obj);
          }
          //console.log("初始化省份");
          for (let i = 0; i < that.data.region[0].city.length; i++) {
            var obj = new Object;
            obj.itemid = that.data.region[0].city[i].itemid;
            obj.name = that.data.region[0].city[i].name;
            obj.pid = that.data.region[0].city[i].pid;
            //citys.push(that.data.region[0].city[i].name)
            provinces[1].push(obj);
          }
          //console.log('初始化城市');
          that.setData({
            'provinces': provinces,
            'citys': citys,
            'province': that.data.region[0].name,
            'city': that.data.region[0].city[0].name
          })
        }
      });
  },
  bindMultiPickerChange:function(e){
    console.log(this.data.provinceid);//获取了省份编号
    console.log(this.data.cityid);//获取了城市编号
  },
  bindMultiPickerColumnChange: function (e) { 
    var that = this;
    switch (e.detail.column) { 
      case 0: 
           //当选择了省份的时候
        that.setData({
          "provinces[1]": that.data.region[e.detail.value].city,
          "province": that.data.region[e.detail.value].name,
          "provinceid": that.data.region[e.detail.value].itemid,
          "city": that.data.region[e.detail.value].city[0].name
        });
        break; 
      case 1:
        //当选择了城市以后
        that.setData({
          "city": that.data.provinces[1][e.detail.value].name,
          "cityid": that.data.provinces[1][e.detail.value].itemid
        });      
    } 
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