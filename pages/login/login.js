var api = require("../../utils/api.js"), app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        // app.pageOnLoad(this);
    },
    login: function (e) {
      console.log(e,"------------e----------------")
      var that = this;
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res, "login")
          var params = {
            code: res.code,
            user_info: e.detail.rawData, //用户信息
            encrypted_data: e.detail.encryptedData, //加密数据
            iv: e.detail.iv, //加密算法初始向量
            signature: e.detail.signature //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 signature。
          }
          var method = "GET";
          console.log(params,"----------params----------")
          app.request(api.loginUrl, params, method,
            function (res) {//成功
            console.log(res)
              var result = res.data;
              if (result.code == api.ERR_OK) {
                // console.log(result.data,"list")
                // wx.setStorageSync("_code", res.code)
                app.globalData.userInfo = result.data;
                wx.setStorageSync("_token", result.token)
                // wx.navigateBack({ //返回上一页面或多级页面
                //   delta: 1
                // })
                wx.reLaunch({
                  url: wx.getStorageSync('lastPage') ||'/pages/personInfo/personInfo'
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
        }
      })
    },
    getUserInfo: function(o) {
        console.log("getUserInfo----------\x3e", o), "getUserInfo:ok" == o.detail.errMsg && (wx.showLoading({
            title: "正在登录",
            mask: !0
        }), wx.login({
            success: function(e) {
                var t = e.code;
                getApp().request({
                    url: api.passport.login,
                    method: "POST",
                    data: {
                        code: t,
                        user_info: o.detail.rawData,//用户信息
                        encrypted_data: o.detail.encryptedData,//加密数据
                        iv: o.detail.iv,//加密算法初始向量
                        signature: o.detail.signature//使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 signature。
                    },
                    success: function(e) {
                        if (0 == e.code) {
                            wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data);
                            var t = wx.getStorageSync("login_pre_page");
                            t && t.route || wx.redirectTo({
                                url: "/pages/index/index"
                            });
                            var o = 0;
                            (o = t.options && t.options.user_id ? t.options.user_id : t.options && t.options.scene ? t.options.scene : wx.getStorageSync("parent_id")) && 0 != o && getApp().bindParent({
                                parent_id: o
                            }), wx.redirectTo({
                                url: "/" + t.route + "?" + getApp().utils.objectToUrlParams(t.options)
                            });
                        } else wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            },
            fail: function(e) {}
        }));
    }
});