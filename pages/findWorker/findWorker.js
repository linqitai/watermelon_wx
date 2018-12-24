var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp();
var gzArr = [];
var moreGz = [];
var countGz = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenu: [false, false, true, false, false],
    selectedFlag: false,
    index: false,
    gzArr: [],
    currentData: 0,
    hidden:false,
    maskIsShow: false,
    dialogSureIsShow: false,
    gz:[],
    title:'',
    category_id:'',
    phone:'',
    address:'',
    contents:'',
    has_insurance:1,
    appointment_time:'',
    date: '',
    time: '',
    selecMoreDialog: false,
    moreGz: [],
    selectedMoreGz:[],
    showFlag:false,
    isShowWorkerTypeBox: false,
    animation:'',
    startDate:'',
    endDate: '',
    isShowDatePicker: true,
    isShowTimePicker: false,
    currentPage: '/pages/findWorker/findWorker'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage)
    this.getCategoryList()
    var date = util.getFullDate(Math.floor(new Date().getTime()))
    this.setData({
      startDate: date
    })
  },
  isShowWorkerTypeEvent: function(){
    console.log(this.data.isShowWorkerTypeBox,"this.data.isShowWorkerTypeBox")
    if(this.data.isShowWorkerTypeBox == true){
      this.setData({
        isShowWorkerTypeBox: false,
        selectedFlag: false
      })
    }else {
      this.setData({
        isShowWorkerTypeBox: true,
        selectedFlag: true
      })
    }
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      isShowTimePicker: true
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,
      // isShowDatePicker: false
    })
  },
  getTitle: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  getPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  getGZ: function (items) {
    var category_id = [];
    for (var i = 0; i < items.length; i++) {
      category_id.push(items[i].id)
    }
    return category_id.join(',')
  },
  getGZName: function (items) {
    var category_id = [];
    for (var i = 0; i < items.length; i++) {
      category_id.push(items[i].name)
    }
    return category_id.join(',')
  },
  getTime: function (e) {
    this.setData({
      appointment_time: util.getTime(e.detail.value)
    })
  },
  getAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  getInsurance: function (e) {
    if (this.data.has_insurance == 1) {
      this.setData({
        has_insurance: 0
      })
    } else if (this.data.has_insurance == 0) {
      this.setData({
        has_insurance: 1
      })
    }
    console.log(this.data.has_insurance, "hasInsurance")
  },
  getCategoryList: function () {
    var that = this;
    var params = null
    var method = "GET";
    app.request(api.categoryListUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          that.setData({
            gzArr: result.data
          });
          gzArr = result.data;
          console.log(gzArr, "gzArr")
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
  selectMoreBlockTap: function (e) {
    var indexId = e.currentTarget.dataset.index
    var currentId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.name)
    moreGz = this.data.moreGz
    if (moreGz[indexId].checked == true) {
      moreGz[indexId].checked = false
    } else {
      moreGz[indexId].checked = true
    }
    this.setData({
      moreGz: moreGz
    })
    
    var selectedMoreGz = [];
    for (var i = 0; i < moreGz.length; i++) {
      if (moreGz[i].checked == true) {
        var item = {
          name: moreGz[i].name,
          id: moreGz[i].id
        }
        selectedMoreGz.push(item)
      }
    }
    this.setData({
      selectedMoreGz: selectedMoreGz
    })
    console.log(this.data.selectedMoreGz,"selectedMoreGz")
  },
  selectMoreDialogSureBtn:function(){
    if (this.data.selectedMoreGz.length>0){
      this.maskHide();
    }else{
      this.setData({
        showFlag: true
      })
    }
    console.log(this.data.selectedMoreGz, "this.data.selectedMoreGz")
    
  },
  blockTap: function(e) {
    var indexId = e.currentTarget.dataset.index
    var currentId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.name)
    console.log(gzArr[indexId].checked, "gzArr[indexId].checked")
    var child = e.currentTarget.dataset.child || []
    console.log(child,"child------------------------------")
    // 二级工种弹窗
    if (child.length > 0 && !gzArr[indexId].checked){
      this.setData({
        moreGz: child
      })
      this.setData({
        selecMoreDialog: true,
        maskIsShow: true
      })
    } else if (gzArr[indexId].checked == true){
      this.setData({
        selectedMoreGz: []
      })
    }

    if (gzArr[indexId].checked == true) {
      gzArr[indexId].checked = false
      countGz = countGz - 1
      console.log(this.data.selectedMoreGz,"this.data.selectedMoreGz")
    } else {
      if (countGz == 5){
        wx.showModal({
          title: '提示',
          content: '所选工种不得超过5个',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        gzArr[indexId].checked = true
        countGz = countGz + 1
        console.log("countGz", countGz)
      }
    }
    this.setData({
      gzArr: gzArr
    })
    if (countGz==0){
      this.setData({
        index: false
      })
    }else{
      this.setData({
        index: true
      })
    }
    var gz=[];
    for (var i = 0; i < gzArr.length;i++){
      if(gzArr[i].checked == true){
        var item = {
          name: gzArr[i].name,
          id: gzArr[i].id
        }
        gz.push(item)
      }
    }
    this.setData({
      gz: gz
    })
  },
  getData: function() {
    var params = {
      username: '17326052006',
      password: 'dtc233',
      remember: '1'
    }
    app.request(api.loginUrl, params, 
    function(res) {
      console.log(res)
    }, 
    function (res) {
    console.log(res)
    }, 
    function (res) {
      console.log(res)
    })
  },
  dialogSureBtn: function(e) {
    var that = this;
    console.log(that.data.selectedMoreGz, "that.data.selectedMoreGz")
    var params = {
      "title":that.data.title,
      "category_id": that.getGZ(that.data.gz),
      "remark": that.getGZName(that.data.selectedMoreGz),
      "phone": that.data.phone,
      "address": that.data.address,
      "has_insurance": that.data.has_insurance,
      "appointment_time": parseInt(util.getTime(that.data.date)) + parseInt(that.data.time.split(':')[0]) * 60 * 60 + parseInt(that.data.time.split(':')[1]) * 60,
      "contents": that.data.contents
    }
    var method = "POST";
    console.log(params, "----------params---------------")
    app.request(api.taskAddUrl, params, method,
      function (res) {//成功
        console.log(res, "oK")
        var result = res.data;
        console.log(result.code,"result.code")
        if (result.code == api.ERR_OK) {
          // 微信支付功能
          console.log(result.data,"result.data")
          wx.requestPayment({
            "timeStamp": result.data.timeStamp,         //时间戳，自1970年以来的秒数     
            "nonceStr": result.data.nonceStr, //随机串     
            "package": result.data.package,
            "signType": result.data.signType, //微信签名方式：     
            "paySign": result.data.paySign, //微信签名 
            success: function (res) {
              console.log(res, '--成功--')
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              wx.setStorageSync("_currentData", 0)
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              },1000)
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '支付失败',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            },
            complete: function (res) {
              console.log(res, '--啥也不管--')
            }
          })
        }
      },
      function (res) {//失败
        console.log(res)
      },
      function (res) {//完成
        console.log(res)
      }
    )
    this.maskHide();
  },
  maskHide: function () {
    console.log('click')
    this.setData({
      maskIsShow: false,
      dialogSureIsShow: false,
      selecMoreDialog: false
    })
  },
  preventTouchMove: function (e) {
    console.log('click')
  },
  publish: function (e) {
    var that = this;
    var params = {
      "category_id": that.getGZ(that.data.gz),
      "phone": that.data.phone,
      "title": that.data.title,
      "address": that.data.address,
      "contents": that.data.contents,
      "has_insurance": that.data.has_insurance,
      "appointment_time": parseInt(util.getTime(that.data.date)) + parseInt(that.data.time.split(':')[0]) * 60 * 60 + parseInt(that.data.time.split(':')[1]) * 60 - 8*60*60,
      "time": that.data.time,
    }
    console.log(params,"params")
    if (util.hasNull(params)){
      wx.showModal({
        title: '提示',
        content: '请填写完整信息',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
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
    } else {
      this.setData({
        contents: value
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