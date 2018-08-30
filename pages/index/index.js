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

Page({
  data: {
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
    month: [],
    currentDay: 0
  },
  bindDateChange(e) {
    this.setData({
      'date': e.detail.value
    })
    var _date = this.data.date.split('-')
    var year = _date[0]
    var month = _date[1]
    this._initDay(year, month)
    this.setData({
      currentDay: 1 
    })
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    this.setData({
      currentDay: lineChart.getCurrentDataIndex(e) + 1
    })
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
    this._initDay(today.getFullYear(), today.getMonth())
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
  _initDay(year, month) {
    var m = [] 
    for (var i = 1; i <= new Date(year, month, 0).getDate(); i++) { 
      var account = {
        id: 'd' + i,
        record: (i % 2) > 0,
        month: i,
        selected: (i === 30)
      }
      m.push(account)
    }
    this.setData({
      month: m
    })
  }

})