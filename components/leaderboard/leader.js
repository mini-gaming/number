// components/leaderboard/leader.js
const app = getApp()
const shareDesc1 = '快来测测你的脑力值'
const shareDesc2 = '我的脑力值是$s，不服来战'
const util = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true,
    target: 21, // 脑王完成时间，21秒
    globalMinTime:'21',
    personMinTime:5000,
    curretnTime:0,
    percent: '80%',
    title:'数字华容道',
    timeText:'0'
  },

  /**
   * 当组件被加载
   */
  onLoad() {
    //do nothing
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidden() {
      this.setData({
        isShow: true
      });
      app.globalData.game.setData({
        isAnimation: false
      });
      app.globalData.shareDesc = shareDesc1;
    },
    getGlobalMaxScore(){
      return 10000;
    },
    getPersonalMaxScore(){
      return 6000;
    },
    setCurrentScore(time){
      let timeText = util.displayGamingTime(time);
      this.setData({
        timeText: timeText
      })
    },
    display(){
      this.setData({
        isShow: false
      })
    },
    displayScore(gameInfo){
      this.setCurrentScore(gameInfo.time);
      this.setData({
        isShow: false,
        personMinTime:util.displayGamingTime(gameInfo.personalMaxScore),
        percent: !gameInfo.beatPercent ? '100%' : Math.floor(gameInfo.beatPercent*100)+"%",
        globalMinTime: util.displayGamingTime(gameInfo.kingScore)
      })
      app.globalData.shareDesc = util.replace(shareDesc2, Math.floor(gameInfo.kingScore/gameInfo.time*10000));
    },
    showToast(){
      wx.showModal({
        title: '晒一晒',
        content: '【截图】并分享至【朋友圈】，为你的“最强小脑”疯狂打call',
        showCancel: false,
        success: function(res){
          console.log(res);
        }
      })
    }
  }

});