/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-21 15:46:58
 * @LastEditors: zwcong
 * @LastEditTime: 2024-06-28 14:52:30
 */
const Task = require('./task')

const task = new Task()

// cookie
task.JSESSIONID = 'EAFF15EE85BBBE251C155DB0D6382E11'

// 配置信息
task.scheduleSeconds = 5   // 每隔几秒开始定时任务
task.date = '20240702'      // 抢场地的日期
task.startTime = 40         // 抢场地的开始时间，需要*2
task.endTime = 44           // 抢场地的结束时间，需要*2
task.block = 1              // 抢场地的块数（小时数）同一块场地

// task.scheduleStartTime = '2024-04-23 07:59:00' //定时开始时间
// task.scheduleStartEnd = '2024-04-23 08:12:00' //定时结束时间

// task.reverse = true        //是否倒序（从大号场地开始）

// 运行任务
task.run()

