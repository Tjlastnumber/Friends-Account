// pages/account-input/account-input.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: [],
    todayAccount: {
    },
    someDay: {},
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var today = new Date()
    var _someDay = options.year ? {
      year: +options.year,
      month: +options.month,
      day: +options.day
    } : {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
    }

    this.setData({
      someDay: _someDay,
      account : wx.getStorageSync('Account') || []
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _someDay = this.data.someDay
    this.setData({
      todayAccount: this._getAccountDate(_someDay.year, _someDay.month, _someDay.day)
    })
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
  
  },
  save() {
    var someDay = this.data.someDay
    var todayAccount = {
      key: someDay.day,
      date: someDay.year + "/" + someDay.month + "/" + someDay.day,
      account: {
        income: {
          total: (this.data.todayAccount.account.income.total || 0) + this.data.amount,
          detail: []
        },
        expenses: {
          total: 0,
          detail: []
        }
      } 
    } 
    this._getAccountDate(someDay.year, someDay.month, someDay.day, todayAccount)
    wx.setStorageSync('Account', this.data.account)
    wx.navigateBack({
      delta: 1
    })
  },
  _getAccountDate(year, month, day, newData) {
    var newDay = newData || {
            key: day,
            date: year + "/" + month + "/" + day,
            account: {
              income: {
                total: 0,
                detail: []
              },
              expenses: {
                total: 0,
                detail: []
              },
            }
          }
    var result = newDay
    var haveYear = this.data.account.find(y => y.key === year)

    if (!haveYear) {
      this.data.account.push({
        key: year,
        month: [{
          key: month,
          days: [newDay]
        }]
      })
    } else {
      var haveMonth = haveYear.month.find(m => m.key === month) 
      if (!haveMonth) {
        haveYear.month.push({
          key: month,
          days: [newDay]
        })
      } else {
        var haveDay = haveMonth.days.find(d => d.key === day)
        if (!haveDay) {
          haveMonth.days.push(newDay) 
        } else {
          if (newData) {
            haveMonth.days.splice(haveMonth.days.indexOf(haveDay), 1, newDay)
          }
          result = haveDay 
        }
      }
    }
    return result
  },
  _amountChanged(v){
    this.setData({
      amount: +v.detail.value
    }) 
  }
})