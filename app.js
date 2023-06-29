//app.js
App({
  globalData: {
    apiDomain: 'https://ukamnads.icu',
    tipsImage: 'https://upload-images.jianshu.io/upload_images/4697920-7e3814ccc1c2f83f.png'
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    this.fetchVupList()
  },
  fetchVupList () {
    const _this = this
    const vupList = wx.getStorageSync('vuplist') || {}
    if (Object.keys(vupList).length > 0) return
    wx.request({
      url: _this.globalData.apiDomain + '/api/v2/vup-list',
      success (res) {
        if (res.data.code != 200) return
        wx.setStorage({
          key: 'vuplist',
          data: res.data.data,
          success () {
            console.log('vuplist缓存已更新')
          }
        })
      }
    })
  }
})