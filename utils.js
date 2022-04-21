/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-04-21 17:41:06
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-21 17:45:44
 */
const moment = require('moment')

const dateFormat = 'YYYYMMDD'

/**
 * 计算今天是本周第几天
 */
 const getTodayNumber = function () {
  //计算今天是这周第几天
  return moment().format('E');
}

/**
* 获取本周六的日期
* @returns {string}
*/
const getThisSaturday = function () {
  let today = getTodayNumber();
  //周六日期
  return moment().add(6 - today, 'days').locale('zh-cn').format(dateFormat);
};

/**
* 获取本周日的日期
* @returns {string}
*/
const getThisSunday = function () {
  let today = getTodayNumber();
  //周日日期
  return moment().add(7 - today, 'days').locale('zh-cn').format(dateFormat);
}
/**
* 获取本周五的日期
* @returns {string}
*/
const getThisFriday = function () {
  let today = getTodayNumber();
  //周五日期
  return moment().add(5 - today, 'days').locale('zh-cn').format(dateFormat);
}

module.exports = {getThisSaturday, getThisSunday, getThisFriday}