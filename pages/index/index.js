//index.js
const wxCharts = require('../../utils/wxcharts-min.js')
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
var lineChart = null
var options = {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
};
const today = new Date()
var _account = []
var _year = []
var _month = []
var _day = []


Page({
  data: {
    account: _account,
    selectedYear: today.getFullYear(),
    selectedMonth: today.getMonth() + 1,
    currentDay: 1,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    checked: true,
    date: util.formatTime(today),
    currentDate: today,
    oldincome: 0,
    income: 0,
    expenses: 0.00,
  },
  bindDateChange(e) {
    var date = e.detail.value
    var year = date.split('-')[0]
    var month = date.split('-')[1]
    this.setData({
      'date': date,
      selectedYear: year,
      selectedMonth: month,
      currentDay: (year == today.getFullYear() &&
          month == (today.getMonth() + 1)) ?
        today.getDate() : 1
    })
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
      categories.push((i + 1) + '月');
      data.push(Math.random() * (200 - 100) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '收入',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (_year.length === 0 && _month.length === 0 && _day.length === 0) {
      _day = [{
        key: today.getDate(),
        income: this.data.income,
        expenses: this.data.expenses
      }] 
      _month = [{
        key: today.getMonth() + 1,
        day: _day
      }]
      _year = [{
        key: today.getFullYear(),
        month: _month
      }]
    }
    console.log(_year)
    setTimeout(() => {
      this.setData({
        currentDay: today.getDate()
      })
    }, 3000)
    /**
   *    if (app.globalData.userInfo) {
   *   this.setData({
   *     userInfo: app.globalData.userInfo,
   *     hasUserInfo: true
   *   })
   * } else if (this.data.canIUse) {
   *   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
   *   // 所以此处加入 callback 以防止这种情况
   *   app.userInfoReadyCallback = res => {
   *     this.setData({
   *       userInfo: res.userInfo,
   *       hasUserInfo: true
   *     })
   *   }
   * } else {
   *   // 在没有 open-type=getUserInfo 版本的兼容处理
   *   wx.getUserInfo({
   *     success: res => {
   *       app.globalData.userInfo = res.userInfo
   *       this.setData({
   *         userInfo: res.userInfo,
   *         hasUserInfo: true
   *       })
   *     }
   *   })
    } */
    this.createChart();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  _incomeChange(e) {
    this.setData({
      'oldincome': this.data.income
    })
    this.setData({
      'income': e.detail.value
    })
  },
  createChart() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '收入',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }, {
        name: '支出',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 150,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  _selectedDay(e) {
    console.log(e)
    var year = e.detail.year
    var month = e.detail.month
    var day = e.detail.day
    var haveYear = _year.find(y => y === e.detail.year)
    if (!haveYear) {
      this._initAccountDate(year, month, day)
    }
    console.log(_year)
  },
  _initAccountDate(year, month, day) {
    var haveYear = _year.find(y => y.key === year)
    if (!haveYear) {
      _year.push({
        key: year,
        month: [{
          key: month,
          day: [{
            key: day,
            income: 0,
            expenses: 0
          }]
        }]
      })
    } else {
      var haveMonth = haveYear.month.find(m => m.key === month) 
      if (!haveMonth) {
        haveYear.month.push({
          key: month,
          day: [{
            key: day,
            income:0,
            expense:0
          }]
        }) 
      } else {
        var haveDay = haveMonth.day.find(d => d.key === day)
        if (!haveDay) {
          haveMonth.day.push({
            key: day,
            income: 0,
            expenses: 0
          }) 
        }
      }
    }
  }
})