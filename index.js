/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-21 15:46:58
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-14 11:04:24
 */
const schedule = require('node-schedule');
const tiantong = require('./tiantong.js')

// 定时函数
function remindTimer() {
    noticeStart()

    // 每隔10分钟抓取
    schedule.scheduleJob('0 */10 * * * ?', () => {
        noticeStart()
    })

    // 每隔1秒抓取
    // schedule.scheduleJob('*/1 * * * * *', () => {
    //     noticeStart()
    // })
    

    console.log('已开启定时任务！')
}

function noticeStart() {
    console.log('开始抢场地了！')
    // tiantong.getEffectiveSit(tiantong.getThisSaturday(), 28, 32); // 周六
    // tiantong.getEffectiveSit(tiantong.getThisSaturday(), 32, 34); // 周六

    // tiantong.getEffectiveSit(tiantong.getThisSunday(), 28, 34);  // 周日
    // tiantong.getEffectiveSit(tiantong.getThisFriday(), 40, 44);  // 周五
    tiantong.getEffectiveSit('20220417', 28, 40, 1);
}

// 启动函数
remindTimer();


