// pages/todayhistory/todayhistory.js
var date = new Date();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    historys : [],
    year : 1,
    mounth : 0,
    day : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    setDate(that);
    request(that);
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  lastDay : function(e){
      date.setDate(date.getDate() - 1);
      var that = this;
      setDate(that);
      request(that);
  },
  nextDay : function(e){
    date.setDate(date.getDate() + 1);
    var that = this;
    setDate(that);
    request(that);
  },
  nowDay : function(e){
    date= new Date();
    var that = this;
    setDate(that);
    request(that);
  }
})
 function request(that){
   var key = (parseInt(date.getMonth()) + 1 < 10 ? "0" + (parseInt(date.getMonth()) + 1) : parseInt(date.getMonth()) + 1) + "" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
   var history;
   wx.getStorage({
     key: key,
     success: function (res) {
       // success
       console.log(res);
       history = res.data;
       setDateData(that, history);
     },
     fail: function () {
       // fail
       wx.request({
         url: 'https://apic.51wnl.com/CttApi/GetHistoryToday',
         data: {
           skip: '0',
           limit: '20',
           date: key
         },
         success: function (res) {
           console.log(res);
           if (res.statusCode == 200) {
             history = res.data.data.events;
             setDateData(that, history);
             wx.setStorageSync(key, history);
           }
         },
         fail: function (e) {
           that.setData({
             toastHidden: false
           })
         }
       })
     }
     })

}

function setDateData(that,history){
  that.setData({
    historys: history,
  })
}

function setDate(that) {
  that.setData({
    year: date.getFullYear(),
    mounth: date.getMonth() + 1,
    day: date.getDate()
  })
}