var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
const app = getApp()
var arrayTask = []
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    pageSize: 16,
    pageIndex: 1,
    maxlength: 200,
    focus: true,
    autoHeight: true,
    showConfirmBar: true,
    indexWork:0,
    content:'',
    arrayTask: ['美国', '中国', '巴西', '日本'],
    currentPage: '/pages/reportTask/reportTask'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage);
    this.getTaskList();
  },
  bindPickerWorkChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexWork: e.detail.value
    })
  },
  submit:function() {
    var that = this;
    var params = {
      contents: that.data.content,
      address: that.data.url
    }
    var method = "POST";
    console.log(params,"params")
    app.request(api.feedbackPostUrl, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code, "result.code")
        if (result.code == api.ERR_OK) {
          // that.showToast(result.data)
          wx.showToast({
            title: result.data,
            icon: 'success',
            duration: 2000
          })
          setTimeout(function(){
            wx.redirectTo({
              url: "/pages/personInfo/personInfo"
            })
          },2000)
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
  getContent: function(e) {
    var value = e.detail.value;
    var len = value.length;
    console.log(e.detail.value)
    console.log(len)
    if (len >= 200) {
      wx.showModal({
        title: '提示',
        content: '内容不得超过200字',
        success(res) {
          if (res.confirm) {
            console.log("用户点击确认")
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.setData({
        content: value
      })
    }
  },
  submit: function() {
    var that = this;
    var params = {
      task_id: that.data.arrayTask[that.data.indexWork].id,
      report: that.data.content
    }
    console.log(params, 'params')
    if (util.hasNull(params)){
      wx.showToast({
        title: '内容不完整',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var method = "POST";
    app.request(api.reportUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: result.data,
            icon: 'success',
            duration: 2000
          })
        }
      },
      function (res) {//失败
        wx.showToast({
          title: '请求失败',
          icon: 'success',
          duration: 2000
        })
      },
      function (res) {//完成
        // console.log(res)
      }
    )
  },
  // 我抢的单子
  getTaskList: function () {
    var that = this;
    var params = {
      "pageindex": this.data.pageIndex,
      "callbackcount": this.data.pageSize
    }
    var method = "POST";
    app.request(api.list3Url, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          var list = result.data
          for(var i=0;i<list.length;i++) {
            arrayTask.push(list[i])
          }
          that.setData({
            arrayTask: arrayTask
          })
        } else if (result.code == 400) {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                // wx.navigateTo({
                //   url: "pages/workerIn/workerIn"
                // })
                wx.navigateTo({
                  url: '/pages/workerIn/workerIn'
                })
                console.log(res.confirm, "res.confirm")
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
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