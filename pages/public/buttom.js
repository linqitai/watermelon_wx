// pages/public/buttom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenu: [true, false, false, false, false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  changeColor: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log("index", index);
    console.log("changeColor");
    var arr = this.data.currentMenu;
    for (var i = 0; i < arr.length; i++) {
      arr[i] = false;
    }
    arr[index] = true;
    this.setData({
      currentMenu: arr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})