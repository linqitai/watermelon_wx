var api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenu: [true, false, false, false, false],
    carouse: [],
    mini: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    inputShowed: false,
    inputVal: "",
    currentPage:'/pages/index/index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad")
    wx.setStorageSync('lastPage', this.data.currentPage)
    this.getIndexData()
  },
  onDevelope: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: "正在内测中",
      success(res) {
        console.log(res)
        if (res.confirm) {
          console.log(res.confirm, "res.confirm")
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toMini: function(e) {
    console.log(e.currentTarget.dataset.appid,"e.currentTarget.dataset.appid")
    var appid = e.currentTarget.dataset.appid
    if(appid.length<10){
      return;
    }
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      path: e.currentTarget.dataset.url,
      extraData: {
      },
      envVersion: 'release',// 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。	
      success(res) {
        console.log('跳转成功');
      }
    })
  },
  toDetail: function(e) {
    var title = e.currentTarget.dataset.title
    wx.setStorageSync('_title', title)
    var content = e.currentTarget.dataset.content
    wx.setStorageSync('_content', content)
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  getIndexData: function () {
    var that = this;
    var params = {
    }
    var method = "POST";
    app.request(api.indexUrl, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code, "result.code")
        if (result.code == api.ERR_OK) {
          that.setData({
            carouse: result.data.carouse,
            mini: result.data.mini
          })
          console.log(that.data.carouse,"carouse")
          console.log(that.data.mini, "mini")
        }
      },
      function (res) {//失败
        console.log(res)
      },
      function (res) {//完成
        // console.log(res)
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})