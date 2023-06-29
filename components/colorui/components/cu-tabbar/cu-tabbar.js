// components/colorui/components/cu-tabbar.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: String,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [
      { icon: 'homefill', label: '主页' },
      { icon: 'wefill', label: '直播间' },
      { icon: 'rank', label: '排行' },
      { icon: 'search', label: '首页' },
      { icon: 'more', label: '更多' }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateTo (e) {
      const key = e.currentTarget.dataset.icon
      if (key == this.data.current) return
      if (key == 'homefill') wx.navigateTo({ url: '/pages/index/index' })
      if (key == 'wefill') wx.navigateTo({ url: '/pages/channel/index' })
    }
  }
})
