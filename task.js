/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-21 15:46:58
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-21 19:01:27
 */
const schedule = require('node-schedule')
const tiantong = require('./tiantong.js')
const utils = require('./utils.js')

let job = null

class Task {
    constructor(){
      this.scheduleSeconds = 1 //每隔几秒开始定时任务

      this.date = utils.getThisSaturday() //抢场地的日期

      this.startTime = 30 //抢场地的开始时间
      
      this.endTime = 40   //抢场地的结束时间

      this.block = 1 //抢场地的块数（小时数）同一块场地
    }
    /**
     * 运行任务
     */
    run() {
        console.log('已开启定时任务！')

        // 每隔10分钟抓取
        // schedule.scheduleJob('0 */10 * * * ?', () => {
        //     start()
        // })
    
        // 每隔n秒抓取
        job = schedule.scheduleJob(`*/${this.scheduleSeconds} * * * * *`, () => {
            this.start()
        })
    }
    /**
     * 开始任务
     */
    start() {
        console.log('开始抢场地了！')
        // tiantong.getEffectiveSit(utils.getThisSaturday(), 28, 32); // 周六
        // tiantong.getEffectiveSit(utils.getThisSaturday(), 32, 34); // 周六
    
        // tiantong.getEffectiveSit(utils.getThisSunday(), 28, 34);  // 周日
        // tiantong.getEffectiveSit(utils.getThisFriday(), 40, 44);  // 周五
        tiantong.getEffectiveSit(this.date, this.startTime, this.endTime, this.block);
    }
    /**
     * 结束任务
     */
    end(){
      job && job.cancel()
    }
    test(){
      console.log('====')
    }
}
module.exports = Task


