// pages/history/history.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    skip: 0,
    showTop: false,
    topData: {},
    popShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  navigateToChair() {

    // console.log(this.data.topData)
    wx.navigateTo({
      url: '../chair/chair?roomId=' + this.data.topData.roomId + '&chairIndex=' + this.data.topData.chairIndex,
    })
  },
  getHistoryList() {
    let len = this.data.historyList.length;
    let num = 15;
    if (len > 10) num = 10;
    if (this.data.showTop == true) {
      len++;
    };
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 1,
        skip: len,
        num: num
      },
      success: res => {
        console.log(res);
        let changeData = res.result.data;
        changeData.map((item) => {
          item.sDate = item.ssTime.split('T')[0].split('-').join('.');
        })
        this.setData({
          historyList: [...this.data.historyList, ...changeData],
        })
        // console.log(changeData)
        if (this.data.showTop == false && this.data.historyList.length > 0 && this.data.historyList[0].isOver == false) {
          let cData = []
          this.data.historyList.forEach((item, index) => {
            if (index >= 1) {
              cData.push(item)
            }
          })
          console.log(this.data.historyList)
          this.setData({
            showTop: true,
            topData: this.data.historyList[0],
            historyList: cData
          })
          console.log(this.data.topData)
        }
        getApp().globalData.isOver = this.data.showTop;
        console.log(this.data.historyList)
      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })

  },
  todo(e) {
    console.log(e.currentTarget.dataset.todo);
    this.setData({
      todo: e.currentTarget.dataset.todo,
      popShow: true
    })
  },
  onLoad: function (options) {
    this.getHistoryList();
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
    this.getHistoryList();
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
    this.getHistoryList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getHistoryList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  popClose: function () {
    this.setData({
      popShow: false
    })
  }
})