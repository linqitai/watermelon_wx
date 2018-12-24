var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: '/pages/index/index',
    id:'',
    title: '',
    avatarUrl:'https://xywl-1256946438.cos.ap-chengdu.myqcloud.com/ccc%2Fjianzhi%2F%E5%8D%95%E5%AD%90%E8%BD%A6.png',
    phone: '',
    is_done: '', // 是否完成:1完成 2进行中,0还没开始
    gz: '',
    avatar:'',
    address: '',
    appointment_time: '',
    content: '',
    comment:'',
    user_cancel_apply:'',
    master_cancel_apply: '',
    user_id:'',
    userUser_id:'',
    master_id:'',
    order_no:"",
    userMaster_id:'',
    isShowCommentBtn: false,
    master:null,
    showDialog: false,
    commentContent: '',
    isShowSoldOutBtn: false,
    isShowIs_done0SoldOutBtn:false,
    isShowMasterCancalBtn: false,
    isShowUserCancalBtn: false,
    isAcceptBtnShow: false,
    isShowAgreeMasterCancalBtn: false,
    isShowAgreeUserCancalBtn: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id,"options.id")
    this.setData({
      id: options.id*1,
      avatar: options.avatar
    })
    wx.setStorageSync('lastPage', this.data.currentPage)
    console.log(this.data.showDialog,"showDialog")
    this.getUserInfo()
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("成功拨打电话")
      },
    })
  },
  setOrderNo: function() {
    var that = this
    wx.setClipboardData({
      data: that.data.order_no,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  completeTask: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: "确认已完成任务？",
      success(res) {
        console.log(res)
        if (res.confirm) {
          that.completeTaskEvent()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  completeTaskEvent: function() {
    var that = this;
    var params = {
      task_id:that.data.id
    }
    var method = "POST";
    app.request(api.completedUrl, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code, "result.code")
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: "操作成功",
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 2)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
        wx.showModal({
          title: '提示',
          content: result.data,
          showCancel: false,
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
      function (res) {//完成
        // console.log(res)
      }
    )
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  getUserInfo: function () {
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
          that.setData({
            userUser_id: result.data.user_id,
            userMaster_id: result.data.master_id
          })
          that.getDetailInfo()
          
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
  getComment: function (e) {
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
    }else{
      that.setData({
        commentContent: value
      });
    }
  },
  toggleDialog: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  addComment: function() {
    var that = this;
    that.setData({
      showDialog: !that.data.showDialog
    });
  },
  bindFormSubmit2: function (e) {
    var that = this;
    console.log(e, "eeeeeeeeeeeeeeeee")
    wx.showModal({
      title: '提示',
      content: e.detail.formId,
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
  bindFormSubmit: function (e) {
    var that = this;
    console.log(e,"eeeeeeeeeeeeeeeee")
    console.log(that.data.commentContent, "submit")
    console.log(that.data.userUser_id == that.data.user_id,"is?")
    console.log(that.data.is_done,"that.data.is_done")
    // 对师傅的评价
    if (that.data.userUser_id == that.data.user_id && (that.data.is_done == 1 || that.data.is_done == "已完成")) {
      console.log("对师傅的评论")
      var url = api.masterCommentUrl
      that.comment(url)
    }
    // 对任务发布人的评价
    if (that.data.userMaster_id == that.data.master_id && (that.data.is_done == 1 || that.data.is_done == "已完成")) {
      console.log("对发布人的评论")
      var url = api.userCommentUrl
      that.comment(url)
    }
  },
  comment: function(url) {
    var that = this;
    var params = {
      "task_id": this.data.id,
      "comment": this.data.commentContent
    }
    var method = "POST";
    console.log(params,"---------params-------------")
    app.request(url, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code, "result.code")
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 2000
        })
        that.getUserInfo()
        if (result.code == api.ERR_OK) {
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
  getDetailInfo: function() {
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "GET";
    app.request(api.taskDetailUrl, params, method,
      function (res) {//成功
        var result = res.data;
        console.log(result.code,"result.code")
        if (result.code == api.ERR_OK) {
          var task_category = result.data.task_category;
          console.log(task_category,"task_category")
          var gz = []
          for (var i = 0; i < task_category.length;i++){
            gz.push(task_category[i].name)
          }
          console.log(gz, "gz")
          
          that.setData({
            title: result.data.title,
            phone: result.data.phone,
            gz: gz.join('、'),
            remark: result.data.remark,
            address: result.data.address,
            is_done: result.data.is_done,
            appointment_time: util.timestampToTime(result.data.appointment_time),
            content: result.data.content,
            comment: result.data.comment,
            order_no: result.data.order_no,
            user_id: result.data.user_id,
            master_id: result.data.master_id,
            master: result.data.master ? result.data.master:null,
            user_cancel_apply: result.data.user_cancel_apply,
            master_cancel_apply: result.data.master_cancel_apply,
          })
          //同意师傅取消单子按钮的显示与否
          if (that.data.userUser_id == that.data.user_id&&result.data.master_cancel_apply == 1 && result.data.user_cancel_apply==2){
            that.setData({
              isShowAgreeMasterCancalBtn: true
            })
          }
          if (that.data.userMaster_id == that.data.master_id&&result.data.master_cancel_apply == 2 && result.data.user_cancel_apply == 1) {
            that.setData({
              isShowAgreeUserCancalBtn: true
            })
          }

          // 能对师傅评论的条件就是,, 个人信息里的user_id = 任务中的user_id且is_done = 1
          // 能对任务发布者评论的条件就是,, 个人信息里的master_id = 任务中的master_id且is_done = 1
          // 对师傅的评价
          console.log(that.data.userUser_id, "userUser_id")
          console.log(that.data.user_id, "user_id")
          console.log(that.data.is_done,"that.data.is_done")

          if (that.data.userUser_id == that.data.user_id && that.data.is_done == 1) {
            if (result.data.comment!=null){
              console.log(result.data.comment.master_comment, "result.data.comment.master_comment")
              result.data.comment.comment = result.data.comment.master_comment
              that.setData({
                comment: result.data.comment,
              })
            }else{
              that.setData({
                isShowCommentBtn: true,
              })
            } 
          }
          // 是否完成:1完成 2进行中, 0还没开始

          if (that.data.userUser_id != that.data.user_id && that.data.is_done == 0) {
            that.setData({
              isAcceptBtnShow: true,
            })
          }
          console.log(that.data.isAcceptBtnShow,"isAcceptBtnShowisAcceptBtnShowisAcceptBtnShow")
          if (that.data.userUser_id == that.data.user_id && that.data.is_done == 0) {
            that.setData({
              isShowIs_done0SoldOutBtn: true,
            })
          }
          if (that.data.userUser_id == that.data.user_id && that.data.is_done == 2 && that.data.isShowAgreeMasterCancalBtn == false && result.data.user_cancel_apply == 2) {
            that.setData({
              isShowUserCancalBtn: true,
            })
          }
          if (that.data.userMaster_id == that.data.master_id && that.data.is_done == 2 && that.data.isShowAgreeUserCancalBtn == false && result.data.master_cancel_apply == 2){
            that.setData({
              isShowMasterCancalBtn: true,
            })
          }
          // 对任务发布人的评价
          console.log(that.data.userMaster_id,"userMaster_id")
          console.log(that.data.master_id,"master_id")
          if (that.data.userMaster_id == that.data.master_id && that.data.is_done == 1) {
            if (result.data.comment != null) {
              console.log(result.data.comment.user_comment, "result.data.comment.user_comment")
              result.data.comment.comment = result.data.comment.user_comment
              that.setData({
                comment: result.data.comment,
              })
            } else {
              that.setData({
                isShowCommentBtn: true,
              })
            }
          }
          that.setData({
            is_done: that.data.is_done == 1 ? '已完成' : that.data.is_done == 2 ? '进行中' : '待接单',
          })
          console.log(that.data.comment,'comment')
          console.log(that.data, "======data==========")
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
  agreeUserCancalTask: function () {
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "POST";
    app.request(api.masterCancelTaskUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 2)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
  },
  agreeMasterCancalTask: function () {
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "POST";
    app.request(api.userCancelTaskUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 0)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
  },
  userCancelTask: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: "取消单子前要联系师傅，取得对方同意后才能成功取消，您确定要取消单子？",
      success(res) {
        console.log(res)
        if (res.confirm) {
          that.userCancelTaskEvent()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  userCancelTaskEvent: function() {
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "POST";
    app.request(api.userCancelTaskUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 0)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
  },
  masterCancelTask:function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: "取消单子前要联系发布者，取得对方同意后才能成功取消，您确定要取消单子？",
      success(res) {
        console.log(res)
        if (res.confirm) {
          that.masterCancelTaskEvent()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  masterCancelTaskEvent: function () {
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "POST";
    app.request(api.masterCancelTaskUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 2)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
  },
  soldOutTask: function () {
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "POST";
    app.request(api.soldOutUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: "下架任务申请成功，请联系接单师傅，让对方取消接单",
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 0)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
  cancelTask: function(){
    var that = this;
    var params = {
      "task_id": this.data.id
    }
    var method = "POST";
    app.request(api.taskCanceltUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: "取消/下架退款成功,资金稍后到账",
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                console.log(res.confirm, "res.confirm")
                wx.setStorageSync("_currentData", 0)
                wx.reLaunch({
                  url: '/pages/index-Order/index-Order'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
  getTask:function(e) {
    var that = this;
    var params = {
      "task_id": this.data.id,
      "formId":e.detail.formId
    }
    var method = "POST";
    app.request(api.taskAcceptUrl, params, method,
      function (res) {//成功
        var result = res.data;
        if (result.code == api.ERR_OK) {
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
                wx.setStorageSync("_currentData", 2)
                setTimeout(function(){
                  wx.redirectTo({
                    url: '/pages/index-Order/index-Order'
                  })
                }
                ,1000)
                console.log(res.confirm, "res.confirm")
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: result.data,
            showCancel: false,
            success(res) {
              console.log(res)
              if (res.confirm) {
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
})