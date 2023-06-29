// pages/channel/index.js
import area from '../../utils/area'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    viewMode: 0,
    viewList: [
      { icon: 'list', value: 0 },
      { icon: 'apps', value: 1 },
    ],
    tabList: [
      { label: '全部', value: 0 },
      { label: '收藏', value: 1 },
    ],
    typeList: [
      { label: '互动', value: 2 },
      { label: '观看', value: 1 },
      { label: '高能榜', value: 4 },
      { label: '最近直播', value: 0 },
      { label: '收录', value: 3 }
    ],
    interactionRangeList: [
      { label: '10分钟', value: 10 },
      { label: '30分钟', value: 30 },
      { label: '1小时', value: 60 },
      { label: '全部', value: -1 },
    ],
    areaJson: area,
    areaList: [Object.keys(area), area[Object.keys(area)[0]]],
    areaIndex: [0, 0],
    vupList: [],
    groupVup: [],
    groupList: [],
    groupIndex: null,
    channelList: { data: [] },
    formReset: {
      area: null,
      interactionRange: 10,
      type: 2,
      keyword: '',
      ids: null,
      pageNum: 0,
      pageSize: 30
    },
    form: {
      area: null,
      interactionRange: 10,
      type: 2,
      keyword: '',
      ids: null,
      pageNum: 0,
      pageSize: 30
    },
    favorites: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchChannelList(true)
    this.fetchAreaList()
    this.getFavorites()
    // this.fetchVupList()
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
  tabChange(e) {
    const value = e.currentTarget.dataset.value
    let form = this.data.form
    if (value === 0) {
      form.ids = null
    } else {
      let favorites = wx.getStorageSync('favorites') || []
      form.ids = favorites // 获取收藏的主播uid
    }
    this.setData({ form: form, tab: value })
    this.fetchChannelList(true)
  },
  typeChange(e) {
    const value = e.currentTarget.dataset.value
    let form = this.data.form
    form.type = value
    this.setData({ form: form })
  },
  interactionRangeChange(e) {
    const value = e.detail.value
    let form = this.data.form
    form.interactionRange = value
    this.setData({ form: form })
  },
  interactionRangeListChange(e) {
    const value = e.currentTarget.dataset.value
    let form = this.data.form
    form.interactionRange = value
    this.setData({ form: form })
  },
  areaColumnChange(e) {
    const column = e.detail.column
    const index = e.detail.value

    let areaIndex = this.data.areaIndex
    let areaList = this.data.areaList
    areaIndex[column] = index
    if (column === 0) {
      const value = Object.keys(this.data.areaJson)[index]
      areaList[1] = this.data.areaJson[value]
    }
    let form = this.data.form
    form.area = this.data.areaList[1][areaIndex[1]]
    this.setData({
      areaIndex: areaIndex,
      areaList: areaList,
      form: form
    })
  },
  areaChange(e) {
    const areaIndex = e.detail.value
    let form = this.data.form
    const value = this.data.areaList[1][areaIndex[1]]
    form.area = value ? value : ''
    this.setData({ areaIndex: areaIndex, form: form })
  },
  keywordChange(e) {
    const value = e.detail.value
    let form = this.data.form
    form.keyword = value
    this.setData({ form: form })

    console.log(this.data.form)
  },
  groupChange(e) {
    const index = e.detail.value
    const groupName = this.data.groupList[index]
    const vupIds = this.data.groupVup[groupName]
    let form = this.data.form
    form.ids = vupIds
    this.setData({ groupIndex: index, form: form })
  },
  fetchMore() {
    let form = this.data.form
    form.pageNum = form.pageNum + 1
    this.setData({ form: form })
    this.fetchChannelList(false)
  },
  fetchChannelList(inital = true) {
    var _this = this
    wx.request({
      url: app.globalData.apiDomain + '/api/v2/channel/filter',
      method: 'POST',
      data: _this.data.form,
      success(res) {
        if (res.data.code != 200) {
          wx.showToast({ title: res.data.message, icon: 'none' })
          return
        }
        if (inital) {
          _this.setData({ channelList: _this.transformChannelList(res.data.data) })
        } else {
          let channelList = _this.data.channelList
          channelList.data = channelList.data.concat(res.data.data.data)
          channelList = Object.assign(channelList, {
            hasMore: res.data.data.hasMore,
            pageNum: res.data.data.pageNum,
            pageSize: res.data.data.pageSize,
            total: res.data.data.total
          })
          _this.setData({ channelList: _this.transformChannelList(channelList) })
        }
      }
    })
  },
  transformChannelList (channelList) {
    const vupList = wx.getStorageSync('vuplist') || []
    const vupListKey = Object.keys(vupList)
    for (let index = 0; index < channelList.data.length; index++) {
      const element = channelList.data[index]
      if (vupListKey.includes((element.uId + ''))) channelList.data[index].isVtb = true
    }
    return channelList
  },
  fetchAreaList() {
    var _this = this
    wx.request({
      url: app.globalData.apiDomain + '/api/v2/area',
      success(res) {
        if (res.data.code != 200) return
        _this.setData({ areaJson: res.data.data })
      }
    })
  },
  fetchVupList() {
    var _this = this
    wx.request({
      url: 'https://vup-json.laplace.live/vup-slim.json',
      success(res) {
        if (res.data.code != 200) return
        const vupList = res.data.data
        const data = _this.formatVupList2GroupList(vupList)
        console.log(data)
        _this.setData({ vupList: vupList, groupList: data[0], groupVup: data[1] })
      }
    })
  },
  formatVupList2GroupList(vupList = {}) {
    let groupList = []
    let groupVup = {}
    for (let index in vupList) {
      const item = vupList[index]
      if (item.group_name == '') continue
      groupList.push(item.group_name)
      if (groupVup && groupVup[item.group_name]) {
        groupVup[item.group_name].push(index)
      } else {
        groupVup[item.group_name] = []
      }
    }
    return [groupList, groupVup]
  },
  reset() {
    this.setData({ form: this.data.formReset })
  },
  viewModeChange(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ viewMode: value })
    if (value === 1 && [0, 3].includes(this.data.form.type)) {
      let form = this.data.form
      form.type = 2
      this.setData({ form: form })
    }
  },
  getFavorites () {
    let favorites = wx.getStorageSync('favorites') || []
    this.setData({ favorites: favorites })
  }
})