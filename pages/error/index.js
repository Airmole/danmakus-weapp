// pages/error/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsText: '数据接口异常，晚些时候再来试试？',
    desc: '',
    tipsImage: app.globalData.tipsImage
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const tips = options.tips ? options.tips : '临时出了点小问题，晚点来再来试试看？'
    const desc = options.desc ? options.desc : ''
    this.setData({ tipsText: tips, desc: desc })
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

  }
})