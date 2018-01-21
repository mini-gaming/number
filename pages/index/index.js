//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    numbers:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0],
    n: 3, //默认4x4的方正
    type3:"default",
    type4: "",
    timeText:"00:00:00",
    controlBtn:"开始",
    restartBtn:"结束",
    time:'100',
    isFinish:false,
    isStart: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.shuffle();
    this.initGameInfo();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function() {
    this.ranking = this.selectComponent("#ranking");
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  set3type: function(){
    //当前游戏正在进行，不能重新设置
    if (this.data.isStart) {
      return;
    }
    this.setData({
      n:3,
      type3:'default',
      type4:''
    });
    app.globalData.gameInfo.gameType = 3;
    this.shuffle();
    this.stopTimer();
  },
  set4type:function(){
    //当前游戏正在进行，不能重新设置
    if (this.data.isStart){
      return;
    }
    this.setData({
      n: 4.,
      type3: '',
      type4: 'default'
    });
    app.globalData.gameInfo.gameType = 4;
    this.shuffle();
    this.stopTimer();
  },
  startGaming: function(){
    this.shuffle();
    this.startTimer();
    this.setData({
      isStart: true
    })
  },
  //重新布局
  shuffle: function() {
    let array = [];//[1,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    let n = this.data.n;
    console.log(this.data.n);
    for(let i = 0 ; i < n*n -1 ; i++){
      array.push(i+1);
    }
    array.push(0);
    let counter = array.length;
    let tmp = null;
    while(counter > 0){
      let index = Math.floor(Math.random()*counter);
      counter--;
      tmp = array[counter];
      array[counter] = array[index];
      array[index] = tmp;
    }
    console.log(array);
    app.globalData.numbers = array;
    this.setData({
      numbers: array
    })
  },
  //是否可以移动
  isMovable: function(index,blankIndex) {
    let n = this.data.n || 4;
    app.globalData.finished = this.isFinished();
    if (!this.data.isStart){
      return false;
    }
    if (app.globalData.finished){
      return false;
    }
    if(index == 0 || index == n*(n-1)){
      if (index + 1 == blankIndex || index + n == blankIndex || index - n == blankIndex){
        return true;
      }
      return false;
    }
    if(index == n-1 || index == n*n -1){
      if(index -1 == blankIndex || index + n == blankIndex || index - n == blankIndex) {
        return true;
      }
      return false;
    }
    if((index > 0 && index < n-1) || (index > n*(n-1) && index < n*n -1)) {
      if (Math.abs(index-blankIndex) == n || Math.abs(index-blankIndex) == 1){
        return true;
      }
      return false;
    }
    for(let i = 1 ; i < n ; i++ ){
      if(index == n*i && (index + 1 == blankIndex || Math.abs(blankIndex-index) == n)) {
        return true;
      }
      if(index == (n*i -1) && (index -1 == blankIndex || Math.abs(blankIndex-index)==n)){
        return true;
      }
    }
    let rowIndex = parseInt(index/n);
    let colIndex = index - rowIndex*n;
    let rowBlankIndex = parseInt(blankIndex/n);
    let colBlankIndex = blankIndex - rowBlankIndex*n;
    if(Math.abs(parseInt((rowBlankIndex - rowIndex)/(colBlankIndex-colIndex))) == 1){
      return false;
    }
    if(Math.abs(blankIndex-index) == 1 && rowIndex != rowBlankIndex){
      return false;
    }
    if(Math.abs(blankIndex-index) == 1 || Math.abs(blankIndex-index)==n){
      return true;
    }
    return false;
  },
  //移动当前模块
  move:function(e){
    let blankIndex = app.globalData.numbers.indexOf(0);
    let index = e.target.dataset.index - 0;
    if (this.isMovable(index,blankIndex)){
      app.globalData.numbers[blankIndex] = app.globalData.numbers[index];
      app.globalData.numbers[index] = 0;
      this.setData({
        numbers:app.globalData.numbers
      })
      this.isFinished();
    }
  },
  isFinished:function(){
    let numbers = app.globalData.numbers;
    let n = this.data.n || 4;
    for(let i = 0 ; i < n*n;i++){
      if(numbers[i] != i+1 && i != n*n -1){
        return false;
      }
      if(i == n*n -1 && numbers[i] != 0){
        return false;
      }
    }
    this.stopTimer();
    app.globalData.gameInfo.isFinished = true;
    this.setData({
      isStart:false
    });
    this.showRanking();
    return true;
  },
  startTimer:function(){
    let startTime = Date.now();
    this.startTime = startTime;
    this.timer = setInterval((function () {        //update the timer every 1s
      this.updateTimer()
    }).bind(this), 1000);
    app.globalData.gameInfo.time = 0;
  },
  stopTimer:function(){
    this.timer && clearInterval(this.timer);
    let endTime = Date.now() - this.startTime;
    app.globalData.gameInfo.time = Math.round(endTime/ 1000);
  },
  updateTimer:function(){
    let now = Date.now();
    let time = Math.round((now-this.startTime) / 1000);
    let M = util.formatGameTime(Math.floor(time / (60)) % 60, 'MM');
    let S = util.formatGameTime(Math.floor(time) % 60, 'SS');
    let H = util.formatGameTime(Math.floor(time/3600)%60,'HH');
    let timeText = H+":"+M+":"+S;
    this.setData({
      timeText: timeText
    })
  },
  initGameInfo: function(){
    app.globalData.gameInfo = {
      gameType:this.data.n || 3,
      time:0,//ss
      isFinished:false
    }
  },
  showRanking() {
    let gameInfo = app.globalData.gameInfo;
    let level = gameInfo.gameType == 3 ? 1:2;
    this.ranking.showResult(gameInfo.time, gameInfo.isFinished, level);
  }
})
