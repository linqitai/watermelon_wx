var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    content: "", // 文本的内容
    images:[],
    tempFilePaths:[],
    url:'',
    maxlength:200,
    focus:true,
    autoHeight:true,
    showConfirmBar:true,
    currentPage: '/pages/index/index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage);
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
      wx.showToast({
        title: '内容超出限制',
        icon: 'warn',
        duration: 2000
      })
    } else {
      this.setData({
        content: value
      })
    }
  },
  upload: function() {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: res => {
        wx.showLoading({
          title: '正在上传...',
          mask: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths,"tempFilePaths")
        console.log(res,"res")
        that.setData({
          tempFilePaths: tempFilePaths
        })
        wx.uploadFile({
          url: api.imgUploadUrl,      //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            "accept": 'application/json',
            "token": wx.getStorageSync("_token")
          },
          formData: {
            'file': tempFilePaths[0]  //其他额外的formdata，可不写
          },
          success: function (res) {
            // var result = res.data
            console.log(res, "res.")
            console.log(res.statusCode,"res.statusCode")
            if (res.statusCode == api.ERR_OK) {
              wx.hideLoading();
              console.log(res, "res-----------------")
              var result = JSON.parse(res.data)
              if(result.data.code==301){
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: result.data.msg,
                  success(res) {
                    console.log(res)
                    if (res.confirm) {
                      console.log(res.confirm, "res.confirm")
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                return;
              }
              console.log(result.code, "result.data.code")
              console.log(result.data, "result.data========================")
              console.log(result.data[0].url,"result.data[0].url")
              that.setData({
                url: result.data[0].url
              })
            }
          },
          fail: function (res) {
            console.log('fail');
          },
        })
      }
    })
  },
  previewImage: function() {
    wx.previewImage({
      current: url, //预览图片链接
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },
  listenerButtonPreviewImage: function(e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index], //预览图片链接
      urls: that.data.tempFilePaths, //图片预览list列表
      success: function(res) {
        //console.log(res);
      },
      fail: function() {
        //console.log('fail')
      }
    })
  }

})