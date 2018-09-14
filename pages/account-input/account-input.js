// pages/account-input/account-input.js
const modules = require('../../modules/index.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountCollection: new modules.AccountCollection(),
    account: new modules.Account(),
    someDay: {},
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = util.today()
    const someDay = options.year ? {
      year: util.toNumber(options.year),
      month: util.toNumber(options.month),
      day: util.toNumber(options.day)
    } : today

    let accountCollection = new modules.AccountCollection(wx.getStorageSync('Account'))

    console.log(accountCollection.get())

    this.setData({
      someDay: someDay,
      accountCollection: accountCollection,
      account: accountCollection.get(someDay) || new modules.Account()
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

  },
  save() {
    var someDay = this.data.someDay
    let account = this.data.accountCollection.get(someDay)
    account = account || new modules.Account()
    account.add('测试', this.data.amount)
    this.data.accountCollection.addOrUpdate(account, someDay)

    wx.setStorageSync('Account', this.data.accountCollection.get())
    wx.navigateBack({
      delta: 1
    })
  },
  _amountChanged(v) {
    this.setData({
      amount: util.toNumber(v.detail.value)
    })
  }
})