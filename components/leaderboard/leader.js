// components/leaderboard/leader.js

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
    globalMaxScore:10000,
    personMaxScore:5000,
    curretnScore:0,
    percent: '80%',
    title:'数字华容道'
  },

  /**
   * 当组件被加载
   */
  onLoad() {
    let globalMaxScore = this.getGlobalMaxScore();
    let personMaxScore = this.getPersonalMaxScore();
    this.setData({
      globalMaxScore: globalMaxScore,
      personMaxScore: personMaxScore
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidden() {
      this.setData({
        isShow: true
      })
    },
    getScore(time) {
      let target = this.data.target;
      return Math.floor(target/(time-0) * 10000);
    },
    getGlobalMaxScore(){
      return 10000;
    },
    getPersonalMaxScore(){
      return 6000;
    },
    setCurrentScore(time){
      let currentScore = this.getScore(time);
      this.setData({
        curretnScore: currentScore
      })
    },
    displayScore(time){
      this.setCurrentScore(time);
      this.setData({
        isShow: false
      })
    }
  }

});