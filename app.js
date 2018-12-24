App({
  request(url, postData, method, doSuccess, doFail, doComplete) {
    // var host = getApp().conf.host;
    console.log(wx.getStorageSync("_token"), "token")
    wx.showNavigationBarLoading()
    wx.request({
      url: url,
      data: postData,
      header: {
        // wx.getStorageSync('token')
        // "content-type": "application/x-www-form-urlencoded", 
        "content-type": "application/json",
        "token": wx.getStorageSync("_token")
      },
      method: method,
      success: function (res) {
        wx.hideNavigationBarLoading()
        if(res.data.code == 401){
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else if (res.data.code == 999){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.data + ",若想继续使用请联系平台客服",
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
        
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        if (typeof doFail == "function") {
          doFail();
        }
      },
      complete: function (res) {
        wx.hideNavigationBarLoading()
        // if (!res.data.code) {
        //   wx.showModal({
        //     title: '提示',
        //     content: "接口丢失",
        //     success(res) {
        //       console.log(res)
        //       if (res.confirm) {
        //         console.log(res.confirm, "res.confirm")
        //       } else if (res.cancel) {
        //         console.log('用户点击取消')
        //       }
        //     }
        //   })
        // }
        if (typeof doComplete == "function") {
          doComplete();
        }
      }
    });
  },
  onLaunch: function () {
  },
  globalData: {
    userInfo: null
  }
})