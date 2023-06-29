// pages/channel/detail.js
const util = require("../../utils/util")
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    isFavorite: false,
    uId: '',
    channel: '',
    lives: [],
    maxWatchCount: 0,
    maxInteractionCount: 0,
    avgDanmakus: 0,
    avgLiveHours: 0,
    startAt: '',
    endAt: '',
    emptyImage: 'https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png',
    isVtb: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const uId = options.uid ? options.uid : ''
    if (!uId) {
      console.log('缺少uid参数，跳转回列表页', options)
      wx.redirectTo({ url: '/pages/channel/index' })
      return
    }
    const isVtb = util.isVtb(uId)
    this.setData({ uId: uId, isVtb: isVtb })
    this.hasFavorite()
    this.fetchChannelInfo()
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
  fetchChannelInfo() {
    var _this = this
    wx.request({
      url: app.globalData.apiDomain + `/api/v2/channel?uId=${_this.data.uId}`,
      success(res) {
        if (res.data.code != 200) {
          const desc = JSON.stringify(res.data)
          wx.redirectTo({ url: `/pages/error/index?desc=${desc}` })
        }
        _this.calcAnalyseData(res.data.data)
        _this.setData({ isLoading: false, channel: res.data.data, lives: res.data.data.lives })
      }
    })
  },
  calcAnalyseData(data, start = null, end = null) {
    let totalDanmakuCount = 0
    let totalLiveSecond = 0
    if (data.channel && data.channel.totalDanmakuCount) totalDanmakuCount = data.channel.totalDanmakuCount
    if (data.channel && data.channel.totalLiveSecond) totalLiveSecond = data.channel.totalLiveSecond
    let maxWatchCount = 0
    let maxInteractionCount = 0

    let allWatchCount = []
    let allInteractionCount = []
    let allStartDate = []
    const lives = []
    data.lives.forEach(element => {
      if (start && start > element.startDate) return
      if (end && end < element.endDate) return
      lives.push(element)
      if (start !== null && end !== null) totalDanmakuCount = totalDanmakuCount + element.danmakusCount
      if (start !== null && end !== null) totalLiveSecond = totalLiveSecond + ((element.stopDate - element.startDate) / 1000)
      allWatchCount.push(element.watchCount)
      allInteractionCount.push(element.interactionCount)
      allStartDate.push(element.startDate)
    });
    maxWatchCount = Math.max(...allWatchCount)
    maxInteractionCount = Math.max(...allInteractionCount)
    let startAt = Math.min(...allStartDate)
    let endAt = Math.max(...allStartDate)
    let avgDanmakus = parseInt(totalDanmakuCount / lives.length)
    let avgLiveHours = ((totalLiveSecond / lives.length) / 60 / 60).toFixed(1)

    startAt = new Date(startAt)
    startAt = `${startAt.getFullYear()}-${startAt.getMonth() + 1}-${startAt.getDate()}`
    endAt = new Date(endAt)
    endAt = `${endAt.getFullYear()}-${endAt.getMonth() + 1}-${endAt.getDate()}`

    this.setData({
      totalDanmakuCount: totalDanmakuCount,
      totalLiveSecond: totalLiveSecond,
      maxWatchCount: maxWatchCount,
      maxInteractionCount: maxInteractionCount,
      avgDanmakus: avgDanmakus,
      avgLiveHours: avgLiveHours,
      startAt: startAt,
      endAt: endAt,
      lives: lives
    })
    if (!start && !end) this.setData({ startLimit: util.formatTime(startAt), endLimit: util.formatTime(endAt) })
    return lives
  },
  goBack() {
    wx.navigateBack({ delta: 1, fail() { wx.redirectTo({ url: '/pages/channel/index' }) } })
  },
  copyText(e) {
    const content = e.currentTarget.dataset.copy
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({ title: '链接已复制到粘贴板，可打开浏览器访问', icon: 'none' })
      }
    })
  },
  hasFavorite() {
    let favorites = wx.getStorageSync('favorites') || []
    if (favorites.includes(parseInt(this.data.uId))) {
      this.setData({ isFavorite: true })
    } else {
      this.setData({ isFavorite: false })
    }
  },
  setFavorite() {
    const uId = this.data.uId
    let favorites = wx.getStorageSync('favorites') || []
    if (favorites.includes(uId)) return
    favorites.push(parseInt(uId))
    var _this = this
    wx.setStorage({
      key: 'favorites',
      data: favorites,
      success() {
        wx.showToast({ title: '已收藏', icon: 'success' })
        _this.setData({ isFavorite: true })
      }
    })
  },
  cancelFavorite() {
    const uId = this.data.uId
    let favorites = wx.getStorageSync('favorites') || []
    if (!favorites.includes(parseInt(uId))) return
    const newFavorites = []
    for (let index = 0; index < favorites.length; index++) {
      const element = favorites[index]
      if (element == uId) continue
      newFavorites.push(element)
    }

    var _this = this
    wx.setStorage({
      key: 'favorites',
      data: newFavorites,
      success() {
        _this.setData({ isFavorite: false })
        wx.showToast({ title: '已取消收藏', icon: 'success' })
      }
    })
  },
  startAtChange(e) {
    const date = e.detail.value
    this.setData({ isLoading: true, startAt: date })
    const startTimestamp = util.formatDate2Timestamp(date)
    const endTimestamp = util.formatDate2Timestamp(this.data.endAt)

    console.log(date, startTimestamp)
    this.calcAnalyseData({ channel: {}, lives: this.data.channel.lives }, startTimestamp, endTimestamp)
    this.setData({ isLoading: false })
  },
  endAtChange(e) {
    const date = e.detail.value
    this.setData({ isLoading: true, endAt: date })
    const startTimestamp = util.formatDate2Timestamp(this.data.startAt)
    const endTimestamp = util.formatDate2Timestamp(date)
    this.calcAnalyseData({ channel: {}, lives: this.data.channel.lives }, startTimestamp, endTimestamp)
    this.setData({ isLoading: false })
  },
})