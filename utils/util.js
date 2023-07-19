const formatTime = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate2Timestamp = date => {
  date = new Date(date)
  return date.getTime()
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isVtb = uId => {
  const vupList = wx.getStorageSync('vuplist') || {}
  const keys = Object.keys(vupList)
  if (keys.includes((uId + ''))) return true
  return false
}

const rpx2px = rpx => {
  let deviceWidth = wx.getSystemInfoSync().windowWidth
  let px = (deviceWidth / 750) * Number(rpx)
  return Math.floor(px)
}

const px2rpa = px => {
  let deviceWidth = wx.getSystemInfoSync().windowWidth
  let rpx = (750 / deviceWidth) * Number(px)
  return Math.floor(rpx)
}

const sortByKey = (property, asc = true) => {
  asc = asc == true ? -1 : 1  
  return function (value1, value2) {
     let a = value1[property]
     let b = value2[property]
     return a < b ? asc : a > b ? asc * -1 : 0
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate2Timestamp: formatDate2Timestamp,
  isVtb: isVtb,
  px2rpa: px2rpa,
  rpx2px: rpx2px,
  sortByKey: sortByKey
}
