var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: '/pages/index/index'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = wx.getStorageSync('_title')
    wx.navigationBarTitleText = title
    wx.setStorageSync('lastPage', this.data.currentPage)
    // var content = options.content
    // console.log(content,"content")
    var data = wx.getStorageSync('_content')
    WxParse.wxParse('data','html',data,this)
    // this.getData()
  },
  getData: function(){
    var that = this;
    var data = '<div style="color:red;text-align:center;padding:20px;">success</div>';
    WxParse.wxParse('data', 'html', data, that);
    var params = {
      pageindex: 1,
      callbackcount: 8
    }
    var method = "POST";
    app.request(api.userListUrl, params, method,
      function (res) {//成功
        console.log(res,"成功res")
        var result = res.data;
        if (result.code == api.ERR_OK) {
          
        }
      },
      function (res) {//失败
        console.log(res)
      },
      function (res) {//完成
        // console.log(res)
      }
    )
  }
})