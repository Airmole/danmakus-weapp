// pages/live/detail.js
const util = require("../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordRes: { series: [] },
    wordcloudOption: {
      background: 'rgba(17,17,21,1)',
      tooltip: {
        showArrow: false,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#FF0000",
        bgColor: "#FFFFFF",
        bgOpacity: 0.9,
        fontColor: "#000000",
        splitLine: false
      },
      series: [{
        type: "wordCloud",
        shape: "circle",
        keepAspect: !1,
        left: "center",
        top: "center",
        width: "100%",
        height: "100%",
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: !1,
        layoutAnimation: !0,
        textStyle: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: function () {
            return Y[Math.floor(Math.random() * Y.length)]
          }
        },
        emphasis: {
          focus: "self",
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: "#333"
          }
        },
      }]
    },
    onlineRes: {
      xAxis: {
        disableGrid: true,
        scrollShow: true
      },
      categories: [],
      series: [
        {
          name: "高能榜",
          lineType: "solid",
          data: []
        }
      ]
    },
    danmakuOptions: {
      dataLabel:false,
      color: ["#1890FF"],
      enableScroll: false,
      xAxis: {
        disableGrid: true,
        labelCount: 6,
      },
      yAxis: {
        gridType: "dash",
        dashLength: 2,
      },
      extra: {
        area: {
          type: "curve",
          addLine: true,
          width: 2,
          gradient: true,
          activeType: "none"
        }
      }
    },
    danmakuRes: {},
    onlineOptions:  {
      dataLabel:false,
      color: ["#1890FF"],
      enableScroll: false,
      xAxis: {
        disableGrid: true,
        labelCount: 6,
      },
      yAxis: {
        gridType: "dash",
        dashLength: 2,
      },
      extra: {
        area: {
          type: "curve",
          addLine: true,
          width: 2,
          gradient: true,
          activeType: "none"
        }
      }
    },
    giftRes: {},
    isLoading: true,
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
      type: [0, 1, 2, 3, 5, 9, 10]
    },
    danmakuPoolHeight: 300,
    danmakus: [],
    danmakusRank: [],
    giftRank: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const liveId = options.liveId ? options.liveId : ''
    this.fetchLiveInfo(liveId)
    const _this = this
    wx.getSystemInfo({
      success(res) {
        const windowHeight = res.windowHeight
        const customBar = app.globalData.CustomBar
        const danmakuPoolHeight = windowHeight - customBar - util.rpx2px(100) - 250
        _this.setData({ danmakuPoolHeight: danmakuPoolHeight, liveId: liveId })
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
  fetchLiveInfo(liveId) {
    const liveInfo = wx.getStorageSync(`live_${liveId}`) || ''
    const filter = this.data.filter
    // 有缓存，使用缓存
    if (liveInfo !== '') {
      this.chunkSetDanmakus(liveInfo.data.danmakus, filter)
      this.setData({
        liveInfo: liveInfo,
        danmakusRank: this.danmakusRank(liveInfo.data.danmakus),
        giftRank: this.giftRank(liveInfo.data.danmakus),
        wordRes: this.wordcloudData(liveInfo.data.live.extra.wordCloud),
        onlineRes: this.onlineData(liveInfo.data.live.extra.onlineRank),
        giftRes: this.giftData(liveInfo.data.danmakus),
        danmakuRes: this.danmakuData(liveInfo.data.danmakus),
        isLoading: false
      })
      return
    }
    // 无缓存，请求接口
    const _this = this
    wx.request({
      url: app.globalData.apiDomain + `/api/v2/live?liveId=${liveId}&includeExtra=true&useEmoji=true&type=6&type=9&type=1&type=2&type=0&type=8&type=7&type=3&type=5`,
      success(res) {
        if (res.data.code != 200) {
          const desc = JSON.stringify(res.data)
          wx.redirectTo({ url: `/pages/error/index?desc=${desc}` })
          return
        }
        const danmakus = _this.filterDanmakus(res.data.data.data.danmakus, filter)
        _this.chunkSetDanmakus(danmakus, filter)
        _this.setData({
          liveInfo: res.data.data,
          danmakusRank: _this.danmakusRank(res.data.data.data.danmakus),
          giftRank: _this.giftRank(res.data.data.data.danmakus),
          wordRes: _this.wordcloudData(res.data.data.data.live.extra.wordCloud),
          onlineRes: _this.onlineData(res.data.data.data.live.extra.onlineRank),
          giftRes: _this.giftData(res.data.data.data.danmakus),
          danmakuRes: _this.danmakuData(res.data.data.data.danmakus),
          isLoading: false
        })
        if (res.data.data.data.live.isFinish) wx.setStorage({ key: `live_${liveId}`, data: res.data.data })
      }
    })
  },
  chunkSetDanmakus (danmakus, filter) {
    const danmakusList = this.filterDanmakus(danmakus, filter)
    const pagesize = 2000
    const page =  Math.ceil(danmakusList.length / pagesize)
    for (let index = 0; index < page; index++) {
      const start = index * pagesize
      const end = (start + pagesize)
      const danmaku = danmakusList.slice(start, end)
      this.setData({ ['danmakus[' + index + ']']: danmaku })
    }
  },
  filterDanmakus(danmakus = [], filter = {}) {
    wx.showLoading({
      title: '筛选中',
    })
    if (Object.keys(filter) == 0) filter = this.data.filter
    if (!filter.minGift && filter.display.includes("gift") && !this.data.displayOptions[3].checked) {
      filter.display.splice(filter.display.indexOf('gift'), 1)
    }
    if (filter.minGift && !filter.display.includes('gift')) filter.display = [...filter.display, 'gift']
    let result = []

    danmakus.forEach(element => {
      if (!filter.type.includes(element.type)) return
      if (filter.display.includes('emoji') && element.message.indexOf('[https://i0.hdslb.com/') >= 0) return
      if (filter.display.includes('avatar')) {
        element.unshowAvarar = true
      } else {
        element.unshowAvarar = false
      }
      if (filter.display.includes('gift') && !element.price) return
      if (filter.minGift && parseFloat(filter.minGift) > parseFloat(element.price)) return
      if (filter.text && !filter.isRegExp && element.message.indexOf(filter.text) == -1) return
      if (filter.text && filter.isRegExp) {
        const pattern = new RegExp(filter.text)
        if (!pattern.test(element.message)) return
      }

      result.push(element)
    })
    if (filter.display.includes('gift')) {
      result = result.sort(util.sortByKey('price'))
    }
    if (filter.display.includes('desc')) result.reverse()
    wx.hideLoading()
    return result
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
  filterChange(e) {
    wx.showLoading()
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
    for (let index = 0; index < filter.type.length; index++) {
      const element = filter.type[index];
      filter.type[index] = parseInt(element)
    }

    if (key == 'type') {
      let danmakuTypes = this.data.danmakuTypes
      for (let index = 0; index < danmakuTypes.length; index++) {
        const element = danmakuTypes[index]
        if (value.includes(element.value)) {
          danmakuTypes[index].checked = true
        } else {
          danmakuTypes[index].checked = false
        }
      }
      this.setData({ danmakuTypes: danmakuTypes })
    }

    if (key == 'display') {
      let displayOptions = this.data.displayOptions
      for (let index = 0; index < displayOptions.length; index++) {
        const element = displayOptions[index]
        if (value.includes(element.value)) {
          displayOptions[index].checked = true
        } else {
          displayOptions[index].checked = false
        }
      }
      this.setData({ displayOptions: displayOptions })
    }

    if (filter.type.includes(10)) filter.type = [...filter.type, 5]
    const danmakus = this.filterDanmakus(this.data.liveInfo.data.danmakus, filter)
    console.log(filter)
    this.setData({ filter: filter, danmakus: danmakus })
  },
  danmakusRank(danmkus = []) {
    let result = []
    let rank = {}
    danmkus.forEach(element => {
      if (element.type != 0) return
      if (!rank[element.uId]) {
        rank[element.uId] = {
          uId: element.uId,
          uName: element.uName,
          num: 1
        }
      } else {
        rank[element.uId].num = parseInt(rank[element.uId].num) + 1
      }
    })
    for (const key in rank) {
      if (Object.hasOwnProperty.call(rank, key)) {
        const element = rank[key]
        result.push(element)
      }
    }
    return result.sort(util.sortByKey('num', 'desc'))
  },
  giftRank(danmakus) {
    let result = []
    let rank = {}
    danmakus.forEach(element => {
      if (element.type != 1 && element.type != 2) return
      if (!rank[element.uId]) {
        rank[element.uId] = {
          uId: element.uId,
          uName: element.uName,
          price: element.price.toFixed(2),
          gift: element.price * 100
        }
      } else {
        rank[element.uId].price = (parseFloat(rank[element.uId].price) + element.price).toFixed(2)
        rank[element.uId].gift = rank[element.uId].gift + (element.price * 100)
      }
    })
    for (const key in rank) {
      if (Object.hasOwnProperty.call(rank, key)) {
        const element = rank[key]
        result.push(element)
      }
    }
    return result.sort(util.sortByKey('gift', 'desc'))
  },
  wordcloudData(wordCloud) {
    let result = { series: [] }
    for (const key in wordCloud) {
      if (Object.hasOwnProperty.call(wordCloud, key)) {
        const element = wordCloud[key]
        result.series.push({
          name: key,
          textSize: (24 / element) * element,
          data: element
        })
      }
    }
    return result
  },
  onlineData (onlineRank) {
    let result = { categories: [], series: [{ name: "高能榜", data: [], pointShape: 'none' }] }
    const categories = []
    const data = []
    for (const key in onlineRank) {
      if (Object.hasOwnProperty.call(onlineRank, key)) {
        const element = onlineRank[key]
        categories.push(util.formatTime(parseInt(key)).slice(-8, -2))
        data.push(element)
      }
    }
    result.categories = categories
    result.series[0].data = data
    return result
  },
  giftData (danmakus) {
    let result = { categories: [], series: [{ name: "收益", data: [], pointShape: 'none' }] }
    const categories = []
    const data = []
    danmakus.forEach(element => {
      if (element.type != 1 && element.type != 2) return
      categories.push(util.formatTime(parseInt(element.sendDate)).slice(-8, -2))
      data.push(element.price)
    })
    result.categories = categories
    result.series[0].data = data
    return result
  },
  danmakuData (danmakus) {
    let result = {
      categories: [],
      series: [
        { name: "弹幕数", data: [], pointShape: 'none' },
        { name: "互动人数", data: [], pointShape: 'none' },
        { name: "弹幕/人数比例", data: [], pointShape: 'none' }
      ]
    }

    const categories = []
    let list = {}
    danmakus.forEach(element => {
      const time = util.formatTime(parseInt(element.sendDate)).slice(-8, -2)
      if (!Object.hasOwnProperty.call(list, time)) {
        list[time] = {
          danmakus: 1,
          peoples: [element.uName],
          proportion: 1
        }
      } else {
        list[time].danmakus = list[time].danmakus + 1
        if (!list[time].peoples.includes(element.uName)) list[time].peoples.push(element.uName)
        list[time].proportion = (list[time].danmakus / list[time].peoples.length).toFixed(2)
      }
    })
    
    const data0 = []
    const data1 = []
    const data2 = []
    for (const key in list) {
      const element = list[key]
      categories.push(key)
      data0.push(element.danmakus)
      data1.push(element.peoples.length)
      data2.push(element.proportion)
    }

    result.categories = categories
    result.series[0].data = data0
    result.series[1].data = data1
    result.series[2].data = data2
    return result
  }
})