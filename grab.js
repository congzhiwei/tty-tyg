const request = require("request")
const jsdom = require("jsdom")
const setLog = require('./log.js')
const config = require('./config.json')


// const JSESSIONID = config.JSESSIONID
const JSDOM = jsdom.JSDOM


class Grab {
    constructor(){
        this.date = ''
        this.JSESSIONID = ''
    }

    getUrl() {
        return "https://webssl.xports.cn/aisports-weixin/court/ajax/1101000301/1002/1602/" + this.date + "?fullTag=0&curFieldType=1602";
        // return "https://webssl.xports.cn/aisports-weixin/court";
    }

    tiantong_place(callback) {
        const url = this.getUrl()
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
                "Cookie": "JSESSIONID=" + this.JSESSIONID,
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
        })
    }

    // len: 数量，默认2个小时
    getEffectiveSit(options) {
        //start = 20, end = 44, len = 2, reverse, failBack
        const start = options.start || 20
        const end = options.end || 44
        const len = options.len || 2
        const reverse = options.reverse || false
        const failBack = options.failBack || function () {}

        let arr = [];
        let arrIndex = 0;
        this.tiantong_place((body) => {
            const document = new JSDOM(body).window.document;
            if(document.title === '失败'){
                console.log('cookie 过期')
                failBack && failBack()
                return
            }
            let classList = document.getElementsByClassName("half-time")
            for (let i = 0; i < classList.length; i++) {
                let spanList = classList[i].getElementsByTagName("span")
                // console.log("第" + i + "个class的span集合长度: " + spanList.length);
                for (let j = 0; j < spanList.length; j++) {
                    let startTime = spanList[j].getAttribute("start-time")
                    let startTimeNum = Number.parseInt(startTime, 10)
                    // 只取早上十点(20)到下午十点(44)开场的场次
                    if (startTimeNum >= start && startTimeNum <= end) {
                        // 过滤未预定的场次 state=0代表为空场和蓝羽区的场地
                        let state = spanList[j].getAttribute("state")
                        let venueName = spanList[j].getAttribute("venue-name")
                        let stateNum = Number.parseInt(state, 10)
                        if (stateNum === 0 && venueName.includes('蓝羽区')) {
                            const id = spanList[j].getAttribute("field-segment-id")
                            arr[arrIndex++] = new Object({date: this.date, startTimeNum, venueName, id})
                        }
                    }
                }
            }
            
            const newArr = this.setGroup(arr, 'venueName')

            setLog(newArr)

            let commitArr = []
            
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


            // console.log('msg', newArr, commitArr)
            console.log('commitArr', commitArr)

            if(commitArr.length){
                // 倒序，先抢大号的场地
                if(reverse){
                    commitArr = commitArr.reverse()
                }
                
                const Commit = require('./commit.js')
                const commit = new Commit(this.JSESSIONID)
                commit.run(commitArr)
            }
        });
    }
    /**
     * 分组
     * @param {*} arr 
     * @param {*} key 
     * @returns 
     */
    setGroup(arr, key){
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
}


// const url = function (date) {
//     return "https://webssl.xports.cn/aisports-weixin/court/ajax/1101000301/1002/1602/" + date + "?fullTag=0&curFieldType=1602";
//     // return "https://webssl.xports.cn/aisports-weixin/court";
// }

// function tiantong_place(url, callback) {
//     request({
//         url: url,
//         method: "GET",
//         json: false,
//         gzip: true,
//         headers: {
//             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//             "Accept-Encoding": "gzip, deflate, br",
//             "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
//             "Connection": "keep-alive",
//             "Cookie": "JSESSIONID=" + JSESSIONID,
//             "dnt": "1",
//             "Host": "webssl.xports.cn",
//             "sec-ch-ua-mobile": "?0",
//             "sec-ch-ua-platform": "Windows",
//             "Sec-Fetch-Dest": "document",
//             "Sec-Fetch-Mode": "navigate",
//             "Sec-Fetch-Site": "none",
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55",
//         }
//     }, function (error, response, body) {
//         if (!error && response.statusCode === 200) {
//             callback(body)
//         }
//     });
// }

// // len: 数量，默认2个小时
// function getEffectiveSit(date, start = 20, end = 44, len = 2, reverse) {
//     let arr = [];
//     let arrIndex = 0;
//     tiantong_place(url(date), (body) => {
//         const document = new JSDOM(body).window.document;
//         if(document.title === '失败'){
//             console.log('cookie 过期')
//             return
//         }
//         let classList = document.getElementsByClassName("half-time");
//         for (let i = 0; i < classList.length; i++) {
//             let spanList = classList[i].getElementsByTagName("span");
//             // console.log("第" + i + "个class的span集合长度: " + spanList.length);
//             for (let j = 0; j < spanList.length; j++) {
//                 let startTime = spanList[j].getAttribute("start-time");
//                 let startTimeNum = Number.parseInt(startTime, 10)
//                 // 只取早上十点(20)到下午十点(44)开场的场次
//                 if (startTimeNum >= start && startTimeNum <= end) {
//                     // 过滤未预定的场次 state=0代表为空场和蓝羽区的场地
//                     let state = spanList[j].getAttribute("state");
//                     let venueName = spanList[j].getAttribute("venue-name");
//                     let stateNum = Number.parseInt(state, 10)
//                     if (stateNum === 0 && venueName.includes('蓝羽区')) {
//                         const id = spanList[j].getAttribute("field-segment-id");
//                         arr[arrIndex++] = new Object({date, startTimeNum, venueName, id});
//                     }
//                 }
//             }
//         }
        
//         const newArr = setGroup(arr, 'venueName')

//         setLog(newArr)

//         let commitArr = []
        
//         // 格式化数据结构
//         newArr.forEach((item)=>{
//             if(item.data && item.data.length >= len){
//                 const fieldInfo = []
//                 let infoArr = {}
//                 item.data.forEach((dt, index)=>{
//                     if(index <= 1){
//                         fieldInfo.push(dt.id)
//                         infoArr = {
//                             fieldInfo,
//                             venueName: dt.venueName,
//                             startTimeNum: dt.startTimeNum,
//                             date: dt.date
//                         }
//                     }
//                 })
//                 commitArr.push(infoArr)
//             }
//         })


//         // console.log('msg', newArr, commitArr)
//         console.log('commitArr', commitArr)

//         if(commitArr.length){
//             // 倒序，先抢大号的场地
//             if(reverse){
//                 commitArr = commitArr.reverse()
//             }
            
//             const Commit = require('./commit.js')
//             const commit = new Commit()
//             commit.run(commitArr)
//         }
//     });
// }
// /**
//  * 分组
//  * @param {*} arr 
//  * @param {*} key 
//  * @returns 
//  */
// function setGroup(arr, key){
//     var  map = {}, dest = [];
//     for ( var  i = 0; i < arr.length; i++){
//         var  ai = arr[i];
//         if (!map[ai[key]]){
//             dest.push({
//                 [key]: ai[key],
//                 data: [ai]
//             });
//             map[ai[key]] = ai;
//         } else {
//             for ( var  j = 0; j < dest.length; j++){
//                 var  dj = dest[j];
//                 if (dj[key] == ai[key]){
//                     dj.data.push(ai);
//                     break ;
//                 }
//             }
//         }
//     }
//     return dest
// }

// module.exports = {getEffectiveSit}
module.exports = Grab