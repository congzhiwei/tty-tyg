//凌风云登录
const http = require("http");
const https = require("https");
const request = require("request");
const axios = require("axios");
const moment = require('moment');
const jsdom = require("jsdom");
const URI = require("url");
const JSDOM = jsdom.JSDOM;
const emailSender = require("./nodemailer.js")
const commit = require('./commit.js')

const JSESSIONID = "91AAB87C876F4F2063DEDEE4D98B2F42";
const dateFormat = 'YYYYMMDD';


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


const url = function (date) {
    return "https://webssl.xports.cn/aisports-weixin/court/ajax/1101000301/1002/1602/" + date + "?fullTag=0&curFieldType=1602";
    // return "https://webssl.xports.cn/aisports-weixin/court";
}

function tiantong_place(jsessionid, url, callback) {
    request({
        url: url,
        method: "GET",
        json: false,
        gzip: true,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "Connection": "keep-alive",
            "Cookie": "JSESSIONID=" + jsessionid,
            "dnt": "1",
            "Host": "webssl.xports.cn",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55",
        }
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body)
        }
    });
}

// len: 数量，默认2个小时
function getEffectiveSit(date, start = 20, end = 44, len = 2) {
    let arr = [];
    let arrIndex = 0;
    tiantong_place(JSESSIONID, url(date), (body) => {
        const document = new JSDOM(body).window.document;
        if(document.title === '失败'){
            console.log('cookie 过期')
            return
        }
        let classList = document.getElementsByClassName("half-time");
        for (let i = 0; i < classList.length; i++) {
            let spanList = classList[i].getElementsByTagName("span");
            // console.log("第" + i + "个class的span集合长度: " + spanList.length);
            for (let j = 0; j < spanList.length; j++) {
                let startTime = spanList[j].getAttribute("start-time");
                let startTimeNum = Number.parseInt(startTime, 10)
                // 只取早上十点(20)到下午十点(44)开场的场次
                if (startTimeNum >= start && startTimeNum <= end) {
                    // 过滤未预定的场次 state=0代表为空场
                    let state = spanList[j].getAttribute("state");
                    // console.log("第" + i + "个class的第" + j + "个span的state属性: " + state);
                    let stateNum = Number.parseInt(state, 10)
                    if (stateNum === 0) {
                        let venueName = spanList[j].getAttribute("venue-name");
                        const id = spanList[j].getAttribute("field-segment-id");
                        arr[arrIndex++] = new Object({date, startTimeNum, venueName, id});
                    }
                }
            }
        }
        let msg = "";
        for (let i = 0; i < arr.length; i++) {
            msg += moment(arr[i].date).locale('zh-cn').format('YYYY年MM月DD日, dddd') + "-" + arr[i].venueName + "-" + arr[i].startTimeNum / 2 + "点" + "\n";
        }

        
        
        const newArr = setGroup(arr, 'venueName')
        const commitArr = []
        
        // 格式化数据结构
        newArr.forEach((item)=>{
            if(item.data && item.data.length >= len){
                const fieldInfo = []
                let infoArr = {}
                item.data.forEach((dt, index)=>{
                    if(index <= 1){
                        fieldInfo.push(dt.id)
                        infoArr = {
                            fieldInfo,
                            venueName: dt.venueName,
                            startTimeNum: dt.startTimeNum,
                            date: dt.date
                        }
                    }
                })
                commitArr.push(infoArr)
            }
        })


        console.log('msg', msg, newArr, commitArr)

        commit(commitArr, JSESSIONID)
        
        // let log = ''
        // if(arr.length){
        //     log = `提醒: 恭喜恭喜，已经, 有${arr.length}个空场地了，${msg}`
        //     sendWebhook(log)
        // }else{
        //     log = `提醒: 抱歉${moment(date).locale('zh-cn').format('YYYY年MM月DD日, dddd')}，暂无空场地`
        // }

        // console.log(log)
        
        // if (arr.length !== 0) {
        //     let sendMailInfo = emailSender.getSendMailInfo("354115516@qq.com", "周末羽毛球有场地了！快去抢啊！", msg);
        //     emailSender.sendMail(sendMailInfo)
        // }
    });
}
/**
 * 分组
 * @param {*} arr 
 * @param {*} key 
 * @returns 
 */
function setGroup(arr, key){
    var  map = {}, dest = [];
    for ( var  i = 0; i < arr.length; i++){
        var  ai = arr[i];
        if (!map[ai[key]]){
            dest.push({
                [key]: ai[key],
                data: [ai]
            });
            map[ai[key]] = ai;
        } else {
            for ( var  j = 0; j < dest.length; j++){
                var  dj = dest[j];
                if (dj[key] == ai[key]){
                    dj.data.push(ai);
                    break ;
                }
            }
        }
    }
    return dest
}

module.exports = {getEffectiveSit, getThisSaturday, getThisSunday, getThisFriday}