var api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexWork: 0,
    index: '',
    currentMenu: [false, false, false, false, true],
    currentData: 0,
    hidden:false,
    maskIsShow: true,
    dialogSureIsShow: true,
    // 展开折叠
    selectedFlag: [false, false, false, false, false, false, false],
    avatarUrl:'',
    category: [],
    nickName: '',
    phone: '', 
    age:'',
    currentPage: '/pages/personInfo/personInfo'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage);
    this.getUserInfo();
  }, 
  buyInsurance: function(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: "敬情期待",
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
  merchantQuestion: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: "敬情期待",
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
  toWorkerIn: function() {
    console.log("click")
    wx.navigateTo({
      url: '/pages/workerIn/workerIn',
    })
  },
  toQuestion: function () {
    console.log("click")
    wx.navigateTo({
      url: '/pages/question/question',
    })
  },
  noFunc: function() {
    
  },
  toReportTask: function() {
    wx.navigateTo({
      url: '/pages/reportTask/reportTask',
    })
  },
  toQuestionBack: function(){
    console.log("click")
    wx.navigateTo({
      url: '/pages/myQuestionBack/myQuestionBack',
    })
  },
  loginAgian: function () {
    console.log("click")
    wx.clearStorageSync();
    this.getUserInfo();
  },
  getUserInfo: function(){
    var that = this;
    var params = {
    }
    var method = "GET";
    app.request(api.userInfoUrl, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code, "result.code")
        if (result.code == api.ERR_OK) {
          // console.log(result.code,"result.code")
          var gz = result.data.category
          var gzattr = []
          for (var i = 0; i < gz.length;i++){
            gzattr.push(gz[i].name)
          }
          var nickName = result.data.nickName;
          for(var i=0;i<nickName.length;i++) {
            nickName = nickName.replace("?", "")
            nickName = nickName.replace("？", "")
            nickName = nickName.replace("", "")
          }
          that.setData({
            avatarUrl: result.data.avatarUrl,
            category: gzattr.join('、'),
            nickName: nickName,
            phone: result.data.phone,
            age: result.data.work_age||"",
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
  },
  // 展开折叠选择  
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;

    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      for (var i = 0; i < this.data.selectedFlag.length; i++) {
        this.data.selectedFlag[i] = false
      }
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  dialogSureBtn: function(e) {
    this.setData({
      maskIsShow: false,
      dialogSureIsShow: false
    })
  },
  maskHide: function (e) {
    console.log('click')
    this.setData({
      maskIsShow: false,
      dialogSureIsShow: false
    })
  },
  preventTouchMove: function (e) {
    console.log('click')
  },
  publish: function (e) {
    console.log('click')
    this.setData({
      maskIsShow: true,
      dialogSureIsShow: true
    })
  },
  bindPickerWorkChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexWork: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  detailInput: function (e) {
    var value = e.detail.value;
    var len = value.length;
    console.log(e.detail.value)
    console.log(len)
    if(len>=200){
      wx.showToast({
        title: '内容超出限制',
        icon: 'warn',
        duration: 2000
      })
    }
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  }
})