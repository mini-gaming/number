// components/hover/hover.js
const app = getApp()

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
    isHover:false,
    isMain:true,
  },

  onLoad(){
    this.setData({
      isHover:false,
      isMain:true
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidden(){
      this.setData({
        isHover:true
      })
      app.globalData.game.initGame();
    },
    showHelp(){
      this.setData({
        isMain:false
      })
    }
  }

});