var util = require('../../utils/util.js')
var date = new Date()
var now = new Date()
var dayCount = "1"
var hide = true
var history = new Array()
var circletop = 10
var daytop = 17

var maxWidth
Page({
  data: {
    date: date,
    year: "1",
    month: "0",
    day: "0",
    todayShow: false,
    dayCount: "1",
    history: [],
    circletop:10,
    daytop:daytop,
    toastHidden:true
  },


  toasthide:function() {
this.setData({
      toastHidden:true
    })
  },

  //前一天
  clickPre: function (e) {
    date.setDate(date.getDate() - 1)
     var that = this
    initdata(that)
    loadhistory(date, function () {
      inithistory(that)
    }, that)
  },
  //后一天
  clickNext: function (e) {
    date.setDate(date.getDate() + 1)
     var that = this
    initdata(that)
    loadhistory(date, function () {
      inithistory(that)
    },that)
  },
  //今天
  clickToday: function (e) {
     date = new Date()
       var that = this
    initdata(that)
    loadhistory(date, function () {
      inithistory(that)
    },that)
  },
  bindDateChange: function (e) {
    date = stringToDate(e.detail.value)
     var that = this
    initdata(that)
    loadhistory(date, function () {
      inithistory(that)
    },that)
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '今日历史-' + date.getFullYear() + '年' + (date.getMonth() +1) + '月' + date.getDate() + '日',
      desc: history[0].yearText + ': ' + history[0].title,
      path: 'pages/today_history/today_history'
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  



  },
  onReady: function () {

    // 页面渲染完成
    

  },
  onShow: function () {
    
    // 页面显示
    var that = this
    initdata(that)
    loadhistory(date, function () {
      inithistory(that)
    },that)
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }

})

function stringToDate(str) {
  var tempStrs = str.split(" ");
  var dateStrs = tempStrs[0].split("-");
  var year = parseInt(dateStrs[0], 10);
  var month = parseInt(dateStrs[1], 10) - 1;
  var day = parseInt(dateStrs[2], 10);

  var date = new Date(year, month, day);
  return date;
}



function loadhistory(date , callback,that) {
  var key = (parseInt(date.getMonth()) + 1 < 10 ? "0" + (parseInt(date.getMonth()) + 1) : parseInt(date.getMonth()) + 1) + "" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

  wx.getStorage({
    key: key,
    success: function(res){
      // success
      history = res.data
       for (var i in history) {
        history[i].title = history[i].title.replace(/\cM|\n/g, " ");
        if (i!= 0 && isNaN(history[i].yearText)) {
         history[i].yearText = history[i].yearText.replace(/[^0-9]/ig, "") + 'BC';
        }
        //if(history[i].yearText)
      }
      typeof callback == "function" && callback()

    },
    fail: function() {
      // fail
      wx.request({
        url: 'https://apic.51wnl.com/CttApi/GetHistoryToday',
    data: {
      skip: '0',
      limit: '20',
      date: key
    },
    type: 'GET',
        // header: {}, // 设置请求的 header
        success: function(res){
          // success
           var v = res.data
      var b = v.data
      history = b.events
      for (var i in history) {
        history[i].title = history[i].title.replace(/\cM|\n/g, " ");
        if (i!= 0 && isNaN(history[i].yearText)) {
         history[i].yearText = history[i].yearText.replace(/[^0-9]/ig, "") + 'BC';
        }
        //if(history[i].yearText)
      }
      wx.setStorageSync(key, history)
      typeof callback == "function" && callback()

        },
        fail:function(e) {
          
          that.setData({
            toastHidden:false
          })
        }
        
      })
    },

  })
}



function inithistory(that) {
  that.setData({
    history: history,
  })
}

function initdata(that) {
  var dayInterval = Math.ceil((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / (1000 * 3600 * 24))

  if (dayInterval == 1) {
    dayCount = "明天"
  } else if (dayInterval > 1) {
    dayCount = dayInterval + "天后"
  } else if (dayInterval == -1) {
    dayCount = "昨天"
  } else if (dayInterval < -1) {
    dayCount = -dayInterval + "天前"
  }
  hide = date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear()
  if(hide) {
    circletop = 20
    daytop = 13
  } else{
    circletop = 10
    daytop = 17
  }
   that.setData({
    date: date,
    year: date.getFullYear(),
    month: date.getMonth() + 1 + "月",
    day: date.getDate(),
    todayShow: !hide,
    dayCount: dayCount,
    circletop:circletop,
    daytop:daytop
  })
}

function getRow(str) {
 
       var textWidth = strlen(str) * 15
       var texthi = 15
       if ((textWidth - maxWidth) > 0) {
          texthi = 30;
       } else{
         texthi = 15;
       }
       return texthi
    
}
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) { 
     var c = str.charCodeAt(i); 
    //单字节加1 
    len++
    }
    return len;
}