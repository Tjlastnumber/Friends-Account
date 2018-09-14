//index.js
const wxCharts = require('../../utils/wxcharts-min.js')
const util = require('../../utils/util.js')
const modules = require('../../modules/index.js')
//获取应用实例
const app = getApp()
var lineChart = null
var options = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
};
const today = util.today()
Page({
    data: {
        accountCollection: new modules.AccountCollection(),
        selectedYear: today.year,
        selectedMonth: today.month,
        currentDay: null,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        checked: true,
        date: util.formatTime(new Date()),
        account: new modules.Account(), 
        income: 0,
        expenses: 0,
        details: [],
        bodyHeight: 0,
        chartHeight: 150,
        scrollTop: 0
    },
    bindDateChange(e) {
        var date = e.detail.value
        var year = util.toNumber(date.split('-')[0])
        var month = util.toNumber(date.split('-')[1])
        var currentDay = (year === today.year &&
            month === today.month) ?
            today.day : 1
        this.setData({
            date: date,
            selectedYear: year,
            selectedMonth: month
        })

        this._selectedDay({
            detail: {
                year: year,
                month: month,
                day: currentDay
            }
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
    createSimulationData: function() {
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
    updateData: function() {
        var simulationData = this.createSimulationData();
        var series = [{
            name: '收入',
            data: simulationData.data,
            format: function(val, name) {
                return val.toFixed(2) + '万';
            }
        }];
        lineChart.updateData({
            categories: simulationData.categories,
            series: series
        });
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {

        setTimeout(() => {
            wx.createSelectorQuery()
                .in(this)
                .select('#header')
                .boundingClientRect(res => {
                    this.setData({
                        bodyHeight: res.height
                    })
                }).exec()
        }, 1500);

        setTimeout(() => {
            this._selectedDay({
                detail: {
                    year: this.data.selectedYear,
                    month: this.data.month,
                    day: today.day
                }
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
    onShow() {
        let accountCollection = new modules.AccountCollection(wx.getStorageSync('Account'))
        let someDay = {
            year: this.data.selectedYear,
            month: this.data.selectedMonth,
            day: this.data.currentDay
        }
        this.setData({
            accountCollection: accountCollection
        })
        this._selectedDay({
            detail: someDay
        })
    },
    onPageScroll(e) {
        var maxH = 150
        var height = e.scrollTop > 75 ? 0 : maxH
        this.setData({
            chartHeight: height
        })
    },
    getUserInfo: function(e) {
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
                format: function(val, name) {
                    return val.toFixed(2) + '元';
                }
            }, {
                name: '支出',
                data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                format: function(val, name) {
                    return val.toFixed(2) + '元';
                }
            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                format: function(val) {
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
        let year = e.detail.year
        let month = e.detail.month
        let day = e.detail.day
        let account = this.data.accountCollection.get({
            year: year,
            month: month,
            day: day
        }) || new modules.Account()
        let details = Object.keys(account.details).map(key => ({key, val: account.details[key]}))
        this.setData({
            currentDay: day,
            account: account,
            income: account.income(),
            expenses: account.expenses(),
            details: details
        })
    },
    navToAccountInput() {
        let query = 'year=' + this.data.selectedYear + '&month=' + this.data.selectedMonth + '&day=' + this.data.currentDay
        wx.navigateTo({
            url: '../account-input/account-input?' + query,
            success: function(res) {
            },
            fail: function() {
            },
            complete: function() {
            }
        })
    }
})