var api = require('../../utils/api.js');
var app = getApp();
var gzArr = [];
var countGz = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenu: [false, false, false, true, false],
    index: '',
    gzArr: [],
    hidden:false,
    phone:"",
    address:"",
    category_id:"",
    age:"",
    img_1: "",
    img_2: "",
    has_insurance:0,
    isShowWorkerTypeBox: false,
    selectedFlag: false,
    hasInfo: false,
    currentPage: '/pages/workerIn/workerIn'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage)
    this.getCategoryList()
    this.getStatus()
  },
  upload: function () {
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
        console.log(tempFilePaths, "tempFilePaths")
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
            if (res.statusCode == api.ERR_OK) {
              wx.hideLoading();
              console.log(res, "res-----------------")
              var result = JSON.parse(res.data)
              that.setData({
                img_1: result.data[0].url
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
  upload2: function () {
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
        console.log(tempFilePaths, "tempFilePaths")
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
            if (res.statusCode == api.ERR_OK) {
              wx.hideLoading();
              console.log(res, "res-----------------")
              var result = JSON.parse(res.data)
              that.setData({
                img_2: result.data[0].url
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
  getStatus: function(){
    var that = this;
    var params = {
    }
    var method = "POST";
    app.request(api.statusUrl, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code,"===result.code===")
        if (result.code == 402) {
          var phone = result.data[0].phone
          console.log(phone, "phone")
          var master_category = result.data[0].master_category
          console.log(master_category, "master_category")
          var gzattr = []
          for (var i = 0; i < master_category.length; i++) {
            gzattr.push(master_category[i].name)
          }
          var work_age = result.data[0].work_age
          var img_1 = result.data[0].img_1
          var img_2 = result.data[0].img_2
          var address = result.data[0].address
          var has_insurance = result.data[0].has_insurance
          that.setData({
            task_status: '入住资料正在审核中',
            hasInfo: true,
            phone: phone,
            master_category: gzattr.join('、'),
            work_age: work_age,
            img_1: img_1,
            img_2: img_2,
            address: address,
            has_insurance: has_insurance
          })
          console.log(that.data, "data")
        }else if(result.code == 200){
          var phone = result.data[0].phone
          console.log(phone, "phone")
          var master_category = result.data[0].master_category
          console.log(master_category, "master_category")
          var gzattr = []
          for (var i = 0; i < master_category.length; i++) {
            gzattr.push(master_category[i].name)
          }
          var work_age = result.data[0].work_age
          var img_1 = result.data[0].img_1
          var img_2 = result.data[0].img_2
          var address = result.data[0].address
          var has_insurance = result.data[0].has_insurance
          that.setData({
            task_status: '入住资料已经通过审核',
            hasInfo: true,
            phone: phone,
            master_category: gzattr.join('、'),
            work_age: work_age,
            img_1: img_1,
            img_2: img_2,
            address: address,
            has_insurance: has_insurance
          })
          console.log(that.data, "data")
        } else if (result.code == 403) {
          that.setData({
            hasInfo: false,
            task_status: result.data
          })
          console.log(that.data.hasInfo,"hasInfo")
          
          // wx.showModal({
          //   title: '提示',
          //   content: result.data,
          //   showCancel: false,
          //   success(res) {
          //     console.log(res)
          //     if (res.confirm) {
          //       console.log(res.confirm, "res.confirm")
          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //     }
          //   }
          // })
        } else if (result.code == 400) {
          that.setData({
            hasInfo: false
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
  isShowWorkerTypeEvent: function () {
    console.log(this.data.isShowWorkerTypeBox, "this.data.isShowWorkerTypeBox")
    if (this.data.isShowWorkerTypeBox == true) {
      this.setData({
        isShowWorkerTypeBox: false,
        selectedFlag: false
      })
    } else {
      this.setData({
        isShowWorkerTypeBox: true,
        selectedFlag: true
      })
    }
  },
  getPhone:function(e){
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  getAge: function (e) {
    console.log(e.detail.value)
    this.setData({
      age: e.detail.value
    })
  },
  getGZ:function(items){
    var category_id = [];
    for (var i = 0; i < items.length;i++){
      category_id.push(items[i].id)
    }
    return category_id.join(',')
  },
  getAddress:function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  getInsurance:function(e){
    if(this.data.has_insurance == 1){
      this.setData({
        has_insurance: 0
      })
    } else if (this.data.has_insurance == 0) {
      this.setData({
        has_insurance: 1
      })
    }
    console.log(this.data.has_insurance,"hasInsurance")
  },
  getCategoryList:function(){
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
          console.log(gzArr,"gzArr")
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
  publishEvent:function(){
    var that = this;
    var params = {
      "category_id": that.getGZ(that.data.gz),
      "work_age": that.data.age,
      "phone": that.data.phone,
      "address": that.data.address,
      "has_insurance": that.data.has_insurance,
      "img_1": that.data.img_1,
      "img_2": that.data.img_2
    }
    var method = "POST";
    console.log(params,"----------params---------------")
    app.request(api.applicationUrl, params, method,
      function (res) {//成功
      console.log(res,"oK")
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
          wx.reLaunch({
            url: '/pages/workerIn/workerIn'
          })
        } else if (result.code == 400){
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel:false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '/pages/index-Order/index-Order'
                })
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
  },
  blockTap: function (e) {
    var indexId = e.currentTarget.dataset.index
    var currentId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.name)
    console.log(gzArr[indexId].checked, "gzArr[indexId].checked")
    if (gzArr[indexId].checked == true) {
      gzArr[indexId].checked = false
      countGz = countGz - 1
    } else {
      if (countGz == 5) {
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
      } else {
        gzArr[indexId].checked = true
        countGz = countGz + 1
        console.log("countGz", countGz)
      }
    }
    this.setData({
      gzArr: gzArr
    })
    if (countGz == 0) {
      this.setData({
        index: false
      })
    } else {
      this.setData({
        index: true
      })
    }
    var gz = [];
    for (var i = 0; i < gzArr.length; i++) {
      if (gzArr[i].checked == true) {
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
  }
})