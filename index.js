/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-21 15:46:58
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-12 11:36:48
 */
const schedule = require('node-schedule');
const tiantong = require('./tiantong.js')
const fs = require("fs");
const moment = require('moment');
const enCode = "utf-8";

// 定时函数
function remindTimer() {

    // 每天上午10:00:00凌风云签到
    schedule.scheduleJob('0 0 10 ? * *', () => {
        noticeStart()
    });

    noticeStart()

    // 每隔10分钟抓取天通苑羽毛球空场地信息
    // schedule.scheduleJob('0 */10 * * * ?', () => {
    //     noticeStart()
    // })

    schedule.scheduleJob('*/1 * * * * *', () => {
        noticeStart()
    })
    

    console.log('已开启定时任务！')
    // const startTime = new Date('2022-04-01 07:59:56');
    // const endTime = new Date('2022-04-01 08:05:30');
    // schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/2 * * * * *' }, () => {
    //     noticeStart()
    // })


    // try{
    //     let second = []
    //     for(var i=0;i<60;i+=2){
    //         second.push(i)
    //     }
    //     console.log('second', second)
    //     // 每周一，二，三
    //     schedule.scheduleJob({ hour: 14, minute: 35, second, dayOfWeek: [4,5] }, (fireDate) => {
    //         console.log('fireDate', fireDate)
    //     })
    // }catch(err){
    //     console.log('err', err)
    // }
}

function noticeStart() {
    // 获取配置
    let configFile = fs.readFileSync("./config.json", enCode);
    let json = JSON.parse(configFile);
    if (json.tiantong) {
        let date = moment(Date.now()).locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
        // 记录日志
        // let oldFile = fs.readFileSync("./log.txt", enCode);
        // oldFile = oldFile + "\n" + date + "   天通苑定时任务开始执行";
        // fs.writeFileSync("./log.txt", oldFile);

        let newFile = fs.readFileSync("./log.txt", enCode);
        // console.log('tiantong.getThisSaturday()', tiantong.getThisSaturday(), typeof tiantong.getThisSaturday())
        
        // tiantong.getEffectiveSit(tiantong.getThisSaturday(), 28, 32); // 周六
        // tiantong.getEffectiveSit(tiantong.getThisSaturday(), 32, 34); // 周六

        // tiantong.getEffectiveSit(tiantong.getThisSunday(), 28, 34);  // 周日
        // tiantong.getEffectiveSit(tiantong.getThisFriday(), 40, 44);  // 周五

        console.log('开始抢场地了！')
        tiantong.getEffectiveSit('20220415', 28, 32);
        // tiantong.getEffectiveSit('20220410', 30, 40, 1);

        newFile = newFile + "\n" + date + "   天通苑定时任务执行成功！";
        // fs.writeFileSync("./log.txt", newFile);
    }
}

// 启动函数
remindTimer();


