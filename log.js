/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-04-14 10:53:20
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-14 10:54:27
 */

const fs = require("fs")
const moment = require('moment')

const enCode = "utf-8"

/**
 * 记录日志
 * @param {*} info 
 */
function setLog(info){
  let oldFile = fs.readFileSync("./log.txt", enCode);
  oldFile = oldFile + "\n" + moment(new Date()).locale('zh-cn').format('YYYY年MM月DD日, dddd, h:mm:ss') + "   " + JSON.stringify(info)
  fs.writeFileSync("./log.txt", oldFile);
}


module.exports = setLog