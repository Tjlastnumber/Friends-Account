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
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    checked: true,
    date: util.formatTime(today),
    oldincome: 0,
    oldexpenses: 0,
    oneDayAccount: {
      income: {
        total: 0,
        detail: []
      },
      expenses: {
        total: 0,
        detail: []
      }
    },
    bodyHeight: 0,
    chartHeight: 150,
    scrollTop: 0
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
  // touchHandler: function (e) {
  //   lineChart.showToolTip(e, {
  //     // background: '#7cb5ec',
  //     format: function (item, category) {
  //       return category + ' ' + item.name + ':' + item.data
  //     }
  //   });
  // },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 12; i++) {
      categories.push((i + 1) + '月');
      data.push(Math.random() * (200 - 100) + 10);
    }
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
    setTimeout(() => {
      wx.createSelectorQuery()
      .in(this)
      .select('#header')
      .boundingClientRect(res => {
        console.log(res)
        this.setData({
          bodyHeight: res.height
        })
      }).exec()
    }, 1500);

    if (_year.length === 0 && _month.length === 0 && _day.length === 0) {
      this.setData({
        oneDayAccount: this._getAccountDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
      }) 
    }
    setTimeout(() => {
      this.setData({
        currentDay: today.getDate()
      })
    }, 1000)
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
  onPageScroll (e) {
    var maxH = 150
    var height = e.scrollTop > 75 ? 0 : maxH
    this.setData({
      chartHeight: height
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
    var year = e.detail.year
    var month = e.detail.month
    var day = e.detail.day
    this.setData({
      currentDay: day
    })
    var dayAccount = this._getAccountDate(year, month, day)
    this.setData({
      oneDayAccount: dayAccount
    })
  },
  _getAccountDate(year, month, day) {
    var haveYear = _year.find(y => y.key === year)
    var newDay = {
            key: day,
            income: {
              total: Math.random() * 100, 
              detail: []
            },
            expenses: {
              total: Math.random() * 200,
              detail: []
            },
          }
    var result = newDay
    if (!haveYear) {
      _year.push({
        key: year,
        month: [{
          key: month,
          day: [newDay]
        }]
      })
    } else {
      var haveMonth = haveYear.month.find(m => m.key === month) 
      if (!haveMonth) {
        haveYear.month.push({
          key: month,
          day: [newDay]
        })
      } else {
        var haveDay = haveMonth.day.find(d => d.key === day)
        if (!haveDay) {
          haveMonth.day.push(newDay) 
        } else {
          result = haveDay
        }
      }
    }
    return result
  }
})