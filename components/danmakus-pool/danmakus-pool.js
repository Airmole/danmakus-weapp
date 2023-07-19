// components/danmakus-pool/danmakus-pool.js
const app = getApp()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    danmakuPoolHeight: {
      type: Number,
      default: 300
    },
    data: {
      type: Array,
      default: []
    },
    liveInfo: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: 'danmakus'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tipsImage: app.globalData.tipsImage
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
