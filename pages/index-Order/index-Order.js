var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp();
var list1 = []
var list2 = []
var list3 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: wx.getStorageSync("_currentData")||0,
    currentMenu: [false, true, false, false, false],
    list1: [],
    list2: [],
    list3: [],
    scrollEnd1:false,
    pageSize1: 8,
    pageIndex1: 1,
    scrollEnd2: false,
    pageSize2: 8,
    pageIndex2: 1,
    scrollEnd3: false,
    pageSize3: 16,
    pageIndex3: 1,
    currentPage: '/pages/index-Order/index-Order',
    reportContent: "",
    showDialog: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('lastPage', this.data.currentPage)
    this.setData({
      currentData: 0
    })
    this.getListByCurrent(this.data.currentData)
  },
  getContent: function (e) {
    var that = this;
    var value = e.detail.value
    var len = value.length;
    console.log(e.detail.value)
    console.log(len)
    if (len >= 50) {
      wx.showToast({
        title: '内容超出限制',
        icon: 'warn',
        duration: 2000
      })
    } else {
      that.setData({
        reportContent: value
      });
    }
  },
  toggleDialog: function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  reportEvent: function(e) {
    console.log('reportUrl button')
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('_taskid', id)
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  bindFormSubmit: function (e) {
    var that = this;
    var params = {
      "task_id": wx.getStorageSync('_taskid'),
      "report": that.data.reportContent
    }
    var method = "POST";
    app.request(api.reportUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          wx.showToast({
            title: result.data,
            icon: 'success',
            duration: 2000
          })
          that.setData({
            showDialog: !that.data.showDialog
          });
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
  onReachBottom:function() {
    console.log("onReachBottom")
  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var tab = e.currentTarget.dataset.tab;
    var avatar = e.currentTarget.dataset.avatar;
    wx.navigateTo({
      url: '/pages/taskDetail/taskDetail?id=' + id + '&tab=' + tab + '&avatar=' + avatar
    })
  },
  getListByCurrent: function (current){
    console.log(current,"current")
    const that = this;
    console.log(that.data.scrollEnd1,"that.data.scrollEnd1")
    console.log(that.data.pageIndex1, "that.data.pageIndex1")
    if (current == 0 && that.data.scrollEnd1 == false) {
      that.getList1();
    }
    if (current == 1 && that.data.scrollEnd2 == false) {
      that.getList2();
    }
    if (current == 2 && that.data.scrollEnd3 == false) {
      that.getList3();
    }
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    var current = e.target.dataset.current
    wx.setStorageSync("_currentData", current)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
      that.getListByCurrent(current)
    }
  },
  //获取当前滑块的index
  bindSwiperchange: function (e) {
    const that = this;
    var current = e.detail.current
    console.log(e.detail.current,"e.detail.current")
    that.setData({
      currentData: current
    })
    that.getListByCurrent(current)
  },
  scrollToBottom3: function () {
    console.log('调用分页接口');
    if (this.data.scrollEnd3 == false) {
      this.setData({
        pageIndex3: (this.data.pageIndex3 + 1)
      })
      this.getList3();
    }
  },
  // 我抢的单子
  getList3:function(){
    var that = this;
    var params = {
      "pageindex": this.data.pageIndex3,
      "callbackcount": this.data.pageSize3
    }
    var method = "POST";
    app.request(api.list3Url, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          var list = result.data
          for (var i = 0; i < list.length; i++) {
            list[i].appointment_time = util.timestampToTime(list[i].appointment_time)
          }
          if (that.data.pageIndex3 == 1) {
            if (that.data.list3.length <= that.data.pageSize3) {
              that.setData({
                list3: list
              });
              list3 = list;
              return;
            }
          }
          for (var i = 0; i < list.length; i++) {
            list3.push(list[i])
          }
          that.setData({
            list3: list3
          });
          if (that.data.list3.length < that.data.pageSize3) {
            console.log("数据已经加载完毕")
            that.setData({
              scrollEnd3: true
            })
            return;
          }
          var a = that.data.list3.length % that.data.pageSize3
          console.log(a, "aaaaaaaaaaaaaaa")
          if (a > 0) {
            wx.showToast({
              title: '数据加载完毕',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              scrollEnd3: true
            })
          }
        }else if(result.code == 400){
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
        console.log(res)
      }
    )
  },
  scrollToBottom1: function() {
    console.log('调用分页接口');
    if (this.data.scrollEnd1==false){
      this.setData({
        pageIndex1: (this.data.pageIndex1 + 1)
      })
      this.getList1();
    }
  },
  getList1: function () {
    var that = this;
    var params = {
      "pageindex": this.data.pageIndex1,
      "callbackcount": this.data.pageSize1
    }
    var method = "POST";
    app.request(api.list1Url, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          // console.log(result.data,"list")
          var list = result.data
          for (var i = 0; i < list.length; i++) {
            list[i].appointment_time = util.timestampToTime(list[i].appointment_time)
          }
          if (that.data.pageIndex1 == 1) {
            if (that.data.list1.length <= that.data.pageSize1) {
              that.setData({
                list1: list
              });
              list1 = list;
              return;
            }
          }
          for (var i = 0; i < list.length; i++) {
            list1.push(list[i])
          }
          that.setData({
            list1: list1
          });
          var a = that.data.list1.length % that.data.pageSize1
          console.log(a, "aaaaaaaaaaaaaaa")
          if (a > 0) {
            console.log("数据已经加载完毕")
            wx.showToast({
              title: '数据加载完毕',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              scrollEnd1: true
            })
          }
        }
      },
      function (res) {//失败
        console.log(res)
      },
      function (res) {//完成
        console.log(res)
      })
  },
  scrollToBottom2: function () {
    console.log('调用分页接口');
    if (this.data.scrollEnd2 == false) {
      this.setData({
        pageIndex2: (this.data.pageIndex2 + 1)
      })
      this.getList2();
    }
  },
  getList2:function(){
    var that = this;
    var params = {
      "pageindex": this.data.pageIndex2,
      "callbackcount": this.data.pageSize2
    }
    var method = "POST";
    app.request(api.list2Url, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK){
          // console.log(result.data,"list")
          var list = result.data
          for(var i=0;i<list.length;i++){
            list[i].appointment_time = util.timestampToTime(list[i].appointment_time)
          }
          if (that.data.pageIndex2==1){
            if (that.data.list2.length <= that.data.pageSize2){
              that.setData({
                list2: list
              });
              list2 = list;
              return;
            }
          }
          for (var i = 0; i < list.length; i++) {
            list2.push(list[i])
          }
          that.setData({
            list2: list2
          });
          if (that.data.list2.length < that.data.pageSize2){
            console.log("数据已经加载完毕")
            that.setData({
              scrollEnd2: true
            })
            return;
          }
          var a = that.data.list2.length % that.data.pageSize2
          console.log(a, "aaaaaaaaaaaaaaa")
          if (a > 0) {
            wx.showToast({
              title: '数据加载完毕',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              scrollEnd2: true
            })
          }
        }
      },
      function (res) {//失败
        console.log("请求失败")
      },
      function (res) {//完成
        // console.log(res)
      })
  },
  
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    // console.log(e.detail)wx.startPullDownRefresh()
  }
})