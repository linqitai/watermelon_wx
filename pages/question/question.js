var api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    currentMenu: [false, false, false, false, true],
    currentData: 0,
    hidden:false,
    maskIsShow: true,
    dialogSureIsShow: true,
    // 展开折叠
    selectedFlag: [false, false, false, false, false, false, false,false],
    avatarUrl:'',
    category: [],
    nickName: '',
    phone: '', 
    age:'',
    currentPage: '/pages/index/index'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage);
    this.getUserInfo();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    // wx.showNavigationBarLoading();
    var that = this;
    console.log("下拉刷新")
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
          that.setData({
            avatarUrl: result.data.avatarUrl,
            category: gzattr.join('、'),
            nickName: result.data.nickName,
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