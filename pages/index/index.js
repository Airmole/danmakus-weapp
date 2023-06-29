//index.js
const util = require("../../utils/util")
//获取应用实例
const app = getApp()
Page({
  data: {
    siteInfo: {},
    timerId: '',
    isLoading: true
  },
  onLoad: function () {
    this.fetch()
    // 每30s更新一次
    const timerId = setInterval(() => {
      this.fetch()
    }, 1000 * 30)
    this.setData({ timerId: timerId })
  },
  fetch () {
    var _this = this
    wx.request({
      url: app.globalData.apiDomain + '/api/v2/site',
      success (res) {
        if (res.data.code != 200) {
          wx.showToast({ title: res.data.message, icon: 'none' })
          return
        }
        res.data.data.date = util.formatTime(res.data.data.date)
        console.log('siteInfo 已更新')
        _this.setData({ siteInfo: res.data.data, isLoading: false })
      },
      fail (error) {
        clearInterval(_this.data.timerId)
        const desc = JSON.stringify(error)
        wx.redirectTo({ url: `/pages/error/index?desc=${desc}` })
        console.log('请求site接口数据异常', error)
      }
    })
  }
})
