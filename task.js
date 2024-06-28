/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-21 15:46:58
 * @LastEditors: zwcong
 * @LastEditTime: 2024-06-28 14:57:16
 */
const schedule = require('node-schedule')
const Grab = require('./grab.js')
const utils = require('./utils.js')

let job = null

class Task {
    constructor(){
      this.scheduleSeconds = 1 //每隔几秒开始定时任务

      this.date = utils.getThisSaturday() //抢场地的日期

      this.startTime = 30 //抢场地的开始时间
      
      this.endTime = 40   //抢场地的结束时间

      this.block = 1 //抢场地的块数（小时数）同一块场地

      this.reverse = false //是否倒序（从大号场地开始）

      this.scheduleStartTime = null

      this.scheduleStartEnd = null

      this.JSESSIONID = ''
    }
    /**
     * 运行任务
     */
    run() {
        this.scheduleStartTime  = this.scheduleStartTime ? new Date(this.scheduleStartTime).getTime() : new Date().getTime()

        console.log('已开启定时任务！')

        // 每隔10分钟抓取
        // schedule.scheduleJob('0 */10 * * * ?', () => {
        //     start()
        // })
    
        // 每隔n秒抓取
        job = schedule.scheduleJob(`*/${this.scheduleSeconds} * * * * *`, () => {
          console.log(new Date().getHours() + '时' + new Date().getMinutes() + '分' + new Date().getSeconds() + '秒')
            if(this.scheduleStartTime < new Date().getTime()){
              console.log('开始定时任务！')
              this.start()
            }
            if(this.scheduleStartEnd){
              if(new Date(this.scheduleStartEnd).getTime() < new Date().getTime()){
                console.log('结束定时任务！')
                this.end()
              }
            }
        })
        this.start()
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
        // tiantong.getEffectiveSit(this.date, this.startTime, this.endTime, this.block, this.reverse);

        const grab = new Grab()
        grab.date = this.date
        grab.JSESSIONID = this.JSESSIONID
        grab.getEffectiveSit({
          //this.startTime, this.endTime, this.block, this.reverse
          start: this.startTime,
          end: this.endTime,
          len: this.block,
          reverse: this.reverse,
          failBack: () => {
            this.end()
          }
        })
    }
    /**
     * 结束任务
     */
    end(){
      job && job.cancel()
    }
}
module.exports = Task


