module.exports = function(o, that) {
  var app = getApp();
  var api = app.api;
  console.log("getUserInfo----------\x3e", o), "getUserInfo:ok" == o.detail.errMsg && (
    wx.showLoading({
      title: "正在登录",
      mask: !0
    }),
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getUserInfo({ 
          success: function(res) {
            console.log('!!!!!!')
            console.log(res);
          }
        })
        console.log(api);
        app.request({
          url: api.home.login,
          data: {
            code: res.code,
            user_info: o.detail.rawData, //用户信息
            encrypted_data: o.detail.encryptedData, //加密数据
            iv: o.detail.iv, //加密算法初始向量
            signature: o.detail.signature //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 signature。
          },
          success: res => {
            console.log(res)
            if (res.code == 200) {
              console.log(res.data,'--个人用户信息--')
              wx.setStorageSync('information', JSON.stringify(res.data))
              wx.setStorageSync('token', res.token)
            }
          }
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    }))

};