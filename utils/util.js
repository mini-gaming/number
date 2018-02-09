const type3numbers = [
  [6, 3, 8, 4, 7, 5, 0, 2, 1],
  [0, 4, 3, 5, 8, 2, 1, 6, 7],
  [0, 3, 5, 7, 2, 6, 1, 4, 8],
  [8, 1, 0, 6, 2, 7, 4, 5, 3],
  [2, 7, 8, 0, 5, 3, 6, 4, 1],
]

const type4numbers = [
  [11,8,6,3,13,7,12,1,0,5,10,9,2,14,15,4],
  [9,10,11,15,12,0,7,6,1,3,8,14,13,5,4,2],
  [4,9,10,5,1,0,2,15,14,13,8,3,7,11,6,12],
  [13,6,7,9,15,3,14,8,0,4,2,5,1,12,11,10],
  [8,1,0,4,12,11,2,7,9,13,3,10,15,5,6,14],
  [0,7,12,3,2,15,11,13,6,8,14,9,5,1,4,10],
  [0,9,1,10,14,12,4,2,3,8,13,6,15,5,11,7]
]

const minPattern = '$s分'
const secPattern = '$s秒'
const hourPattern = '$s小时'

//get the init array
const getDefaultNum = type => {
  if(type == 3){
    return [1, 2, 3, 4, 5, 6, 7, 8, 0];
  }else{
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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

const shuffleType = n => {
  let typeNumbers = n == 3 ? type3numbers : type4numbers;
  let index = Math.floor(Math.random() * typeNumbers.length);
  let numbers = []
  typeNumbers[index].forEach(function(item){
    numbers.push(item);
  });
  return numbers;
}

const replace = (content,replace) => {
  return content.replace(/\$s/i,replace);
}

const replaceZero = (content) => {
  return content.replace(/^0+/,'');
}

const displayGamingTime = (time) => {
    /*let M = replaceZero(formatGameTime(Math.floor(time / (60)) % 60, 'MM'));
    let S = replaceZero(formatGameTime(Math.floor(time) % 60, 'SS'));
    let H = replaceZero(formatGameTime(Math.floor(time / 3600) % 60, 'HH'));
    let timeText = []
    if (H) {
      timeText.push(replace(hourPattern, H));
    }
    if (M) {
      timeText.push(replace(minPattern, M));
    }
    if (S) {
      timeText.push(replace(secPattern, S));
    }
    return timeText.join('');*/
    return time;
}

module.exports = {
  formatTime: formatTime,
  formatGameTime: formatGameTime,
  dialog: dialog,
  shuffleType: shuffleType,
  getDefaultNum: getDefaultNum,
  replaceZero: replaceZero,
  replace: replace,
  displayGamingTime: displayGamingTime
}
