/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-21 15:46:58
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-21 17:49:58
 */
const Task = require('./task')

const task = new Task()

// 配置信息
task.scheduleSeconds = 1   // 每隔几秒开始定时任务
task.date = '20220425'      // 抢场地的日期
task.startTime = 34         // 抢场地的开始时间，需要*2
task.endTime = 35           // 抢场地的结束时间，需要*2
task.block = 1              // 抢场地的块数（小时数）同一块场地

// 运行任务
task.run()

