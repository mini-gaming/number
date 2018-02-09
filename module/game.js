const util = require("../utils/util.js")

const game = {
  "gameId": 1,
  "userId": 10,
  "startTime": "2018-01-28 10:00:00",
  "endTime": "2018-01-28 10:20:00",
  "isFinished": 1, // 1-Completed 0-Incompleted
  "score": 60
}

const getGameId = gameInfo =>{
  return gameInfo.gameType == 3 ? 1:2; //华容道type为3代表3*3，id为1
}

const createGameInfo = (userId,gameInfo) => {
  return {
    "gameId": getGameId(gameInfo),
    "userId": userId,
    "startTime": util.formatTime(new Date(gameInfo.startTime)),
    "endTime": util.formatTime(new Date(gameInfo.startTime + gameInfo.endTime)),
    "isFinished": 1, // 1-Completed 0-Incompleted
    "score": gameInfo.time
  }
}

module.exports = {
  createGameInfo: createGameInfo
}

