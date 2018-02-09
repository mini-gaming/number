//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const service = require('../../service/service.js')
const zqdnGame = require('../../module/game.js')

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
    controlBtn:"开始计时",
    restartBtn:"结束",
    time:'100',
    isFinish:false,
    isStart: false,
    isAnimation: false
  },
  onShareAppMessage:function(){
    return {
      title:'最强小脑-数字华容道',
      desc: app.globalData.shareDesc
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.defaultInit();
    this.initGameInfo();
    app.globalData.game = this;
    app.globalData.shareDesc = '快来测测你的脑力值';
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('get user info');
        app.globalData.userInfo = res.userInfo;
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
    this.hover = this.selectComponent("#hover");
    this.leaderboard = this.selectComponent("#leaderboard");
  },
  clearAnimation:function(){
    if (this.intervalTime) {
      clearInterval(this.intervalTime);
    }
  },
  startAnimation:function(){
    let an = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    });
    let count = 0;
    this.an = an;
    an.top("-160rpx").step();
    this.setData({
      animationData: an.export()
    });
    count++;
    this.intervalTime = setInterval(function () {
      count++;
      if (count % 2 == 1) {
        an.top("-200rpx").step();
      } else {
        an.top("-160rpx").step();
      }
      this.setData({
        animationData: an.export()
      })
    }.bind(this), 300)
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
      n: 4,
      type3: '',
      type4: 'default'
    });
    app.globalData.gameInfo.gameType = 4;
    this.shuffle();
    this.stopTimer();
  },
  startGaming: function(){
    this.setData({
      isStart: true
    });
    this.shuffle();
    this.startTimer();
  },
  setArrayNum: function(array) {
    app.globalData.numbers = array;
    this.setData({
      numbers: array
    })
  },
  defaultInit: function(){
    this.setArrayNum(util.getDefaultNum(this.data.n));
  },
  //重新布局
  shuffle: function() {
    //let array = util.shuffleType(this.data.n);
    if (!this.data.isStart){
      this.setArrayNum(util.getDefaultNum(this.data.n));
    }else{
      this.setArrayNum(util.shuffleType(this.data.n));
    }
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
    let started = this.data.isStart;
    if (!started) {// 如果还没有开始，不计算
      return;
    }
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
    let started = this.data.isStart;
    if(!started){// 如果还没有开始，不计算
      return false;
    }
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
    this.startTime = Date.now();
    this.setData({
      timeText: "00:00:00"
    })
    this.timer = setInterval((function () {        //update the timer every 1s
      this.updateTimer()
    }).bind(this), 1000);
    app.globalData.gameInfo.time = 0;
    app.globalData.gameInfo.endTime = 0;
    app.globalData.gameInfo.startTime = 0;
  },
  stopTimer:function(){
    this.timer && clearInterval(this.timer);
    let endTime = Date.now() - this.startTime;
    app.globalData.gameInfo.time = Math.round(endTime/ 1000);
    app.globalData.gameInfo.endTime = endTime;
    app.globalData.gameInfo.startTime = this.startTime;
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
      isFinished:false,
      endTime:0,
      startTime:0
    }
  },
  showRanking() {
    let leaderboard = this.leaderboard;
    let gameInfo = zqdnGame.createGameInfo(app.globalData.userInfo.userId,app.globalData.gameInfo);
    leaderboard.display();
    service.post(gameInfo,'/game/record',function(ret){
      let personalTime = ret.data.data;
      personalTime.time = gameInfo.score;
      leaderboard.displayScore(personalTime);
    })
    // let gameInfo = ;
    // this.ranking.showResult(gameInfo.time, gameInfo.isFinished, level);
  },
  initGame() {
    this.setData({
      isAnimation:true
    })
    this.startAnimation();
  },
  restartGaming() {
    this.setData({
      isStart:false,
      isAnimation:false
    });
    this.stopTimer();
  }
})
