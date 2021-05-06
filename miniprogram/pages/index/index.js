// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2: true,
    rooms: [
      { "roomId": "122222", "roomName": "小黑屋屋屋屋屋习室1", openTime: "7 : 00 ~ 23 : 00", "chairNum": 50, "sitDown": 12 },
      { "roomId": "333456", "roomName": "小习室2", openTime: "5:00~12:30", "chairNum": 5, "sitDown": 2 },
      { "roomId": "160456", "roomName": "小屋习室3", openTime: "全天开放", "chairNum": 23, "sitDown": 0 },
      { "roomId": "120456", "roomName": "黑屋习室4", openTime: "7:00~8:00", "chairNum": 150, "sitDown": 64 }],

    right: [
      {
        text: 'Delete',
        style: 'background-color: #F4333C; color: white',
      }],
  },
  

  /*
    获取缓存信息
  */
 getHistory(){


  let val = wx.getStorageSync('rooms');
  this.setData({rooms:val});

 },

  /*
    删除历史某个记录
  */
 deleteCard(e){
  //  console.log(e.currentTarget.dataset)
   console.log(e.currentTarget.dataset.index)
  let index = e.currentTarget.dataset.index;
  console.log(index)
  let val = this.data.rooms;
  console.log(val)
  val.splice(index,1)
  console.log(val)
  wx.setStorageSync('rooms',val);
  // console.log(this.data.rooms)
  this.setData({rooms:val});
},

/*
  复制内容
*/
copyRoomId(e){
  console.log(e.currentTarget.dataset.roomid)
          wx.setClipboardData({
                data:  e.currentTarget.dataset.roomid,
                success: function (res) {
                  wx.getClipboardData({
                    success: function (res) {
                      wx.showToast({
                        title: '复制成功'
                      })
                    }
                  })
                }
              })
},

/*
跳转
*/
toRoom(e){
  let val = e.currentTarget.dataset.roomid;
  console.log(val)
  wx.navigateTo({
    url: '/pages/room/room?roomId='+val,
  })
},
scanQR(){
  let sthis = this;
  wx.scanCode({
        
    success: (res) => {
      let result = res.result;
      console.log(result)
      // _this.setData({
        // result: result,
      // })
    }
  })
},

/**
 * 触发输入
 */
typeIn(){

},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory()
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
    this.getHistory();
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