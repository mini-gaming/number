const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const dialog = (message) => {
  wx.showToast({
    title: message,
    duration:3000
  })
  setTimeout(function(){
    wx.hideToast();
  },5000);
}

function formatGameTime(time, format) {
  let temp = '0000000000' + time
  let len = format.length
  return temp.substr(-len)
}

module.exports = {
  formatTime: formatTime,
  formatGameTime: formatGameTime,
  dialog: dialog
}
