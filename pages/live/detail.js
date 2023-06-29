const util = require("../../utils/util")

// pages/live/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveId: '',
    liveInfo: '',
    currentTab: 0,
    topTabs: [
      { label: '弹幕', value: 0 },
      { label: '数据', value: 1 }
    ],
    rankType: 'danmaku',
    rankTypes: [
      { label: '弹幕榜', value: 'danmaku' },
      { label: '礼物榜', value: 'gift' }
    ],
    danmakuTypes: [
      { label: '弹幕', value: 0, checked: true },
      { label: '礼物', value: 1, checked: true },
      { label: '舰长', value: 2, checked: true },
      { label: 'Superchat', value: 3, checked: true },
      { label: '禁言', value: 9, checked: true },
      { label: '主播操作', value: 10, checked: true }
    ],
    danmakuOrRank: 'danmaku',
    showDanmakuTool: false,
    displayOptions: [
      { label: '降序', value: 'desc', checked: false },
      { label: '隐藏表情', value: 'emoji', checked: false },
      { label: '隐藏头像', value: 'avatar', checked: false },
      { label: '按价格排序', value: 'gift', checked: false }
    ],
    priceOptions: ['0.1', '1', '9.9', '30', '100'],
    minGift: '',
    filter: {
      display: [],
      text: '',
      isRegExp: false,
      minGift: 0,
      type: [0, 1, 2, 3, 9, 10]
    },
    danmakuPoolHeight: 300
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const liveId = options.liveId ? options.liveId : ''
    this.fetchLiveInfo(liveId)
    const _this = this
    wx.getSystemInfo({
      success (res) {
        const windowHeight = res.windowHeight
        const customBar = app.globalData.CustomBar
        const danmakuPoolHeight = windowHeight - customBar - util.rpx2px(100) - 220
        _this.setData({ danmakuPoolHeight: danmakuPoolHeight })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  fetchLiveInfo (liveId) {
    const liveInfo = wx.getStorageSync(`live_${liveId}`) || ''
    if (liveInfo !== '') {
      this.setData({ liveInfo: liveInfo })
      return
    }
    const _this = this
    wx.request({
      url: app.globalData.apiDomain + `/api/v2/live?liveId=${liveId}&includeExtra=true&useEmoji=true&type=6&type=9&type=1&type=2&type=0&type=8&type=7&type=3&type=5`,
      success (res) {
        if (res.data.code != 200) {
          const desc = JSON.stringify(res.data)
          wx.redirectTo({ url: `/pages/error/index?desc=${desc}` })
          return
        }
        _this.setData({ liveInfo: res.data.data })
        console.log(res.data.data.data.live.isFinish)
        if (res.data.data.data.live.isFinish) wx.setStorage({ key: `live_${liveId}`, data: res.data.data })
      }
    })
  },
  tabChange(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ currentTab: value })
  },
  switchChange(e) {
    const value = e.detail.value ? 'danmaku' : 'rank'
    this.setData({ danmakuOrRank: value })
  },
  rankTypeChange(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ rankType: value })
  },
  foldBottomPanel() {
    const value = !this.data.showDanmakuTool
    this.setData({ showDanmakuTool: value })
  },
  filterChange (e) {
    const key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == 'isRegExp' && value.length == 0) value = false
    if (key == 'isRegExp' && value.length > 0) value = true
    if (key == 'minGift') {
      if (e.currentTarget.dataset.value) value = e.currentTarget.dataset.value
      this.setData({ minGift: value })
    }

    let filter = this.data.filter
    filter[key] = value
    this.setData({ filter: filter })
    console.log(this.data.filter)
  }
})