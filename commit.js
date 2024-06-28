/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-22 16:05:13
 * @LastEditors: zwcong
 * @LastEditTime: 2024-06-28 14:59:53
 */

const request = require("request");
const axios = require("axios");
const config = require('./config.json')
const setLog = require('./log.js')
const Task = require('./task.js')
const crypto = require('crypto')

// const JSESSIONID = config.JSESSIONID
const number = config.number
const url = 'https://webssl.xports.cn/aisports-weixin/court/commit'

let count = 0

class Commit extends Task{
  constructor(JSESSIONID){
    super()

    this.JSESSIONID = JSESSIONID
  }
  /**
 * 循环执行提交订单
 * @param {*} data 
 */
  async run(data){
    for(const item of data){
      if(count < number){
        let msg = ''
        try{
          const res = await this.submit(item)
          if(res){
            msg = `#### 恭喜恭喜，您抢到了${res?.trade?.tradeDesc}\n`
            count ++
            console.log(msg)
          }
        }catch(err){
          console.log(`未抢到${item.date}, ${err}`)
          if(err.includes('每位会员每天只能预订2片场地')){
            this.end()
          }
        }
        msg && setLog(msg)
        // msg && this.sendWebhook(msg)
        msg && this.sendDingDing(msg)
      }else{
        console.log('抢太多场地了，给别人留点吧')
        this.end()
        break
      }
    }
  }

  // run(data){
  //   for(const item of data){
  //     this.submit(item)
  //   }
  //   setTimeout(()=>{
  //     this.end()
  //   }, 3000)
  // }

  /**
   * 提交订单
   * @param {*} item 
   * @returns 
   */
  submit(item){
    return new Promise((resolve,reject)=>{
      request({
        url: url,
        body: JSON.stringify({
          "venueId": "1101000301",
          "serviceId": "1002",
          "fieldType": "1602",
          "day": item.date,
          // "fieldInfo": "67954947cf9270a167be0b0cafcf81aa,be1d988b47d79f21361af89efafcadf8"
          "fieldInfo": item.fieldInfo.join(',')
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Cookie": `JSESSIONID=${this.JSESSIONID}; Hm_lvt_bc864c0a0574a7cabe6b36d53206fb69=1647918203; gr_user_id=e6a7ae84-38f7-472d-9cee-13589338970e; gr_session_id_ade9dc5496ada31e=403a8292-7b51-43ba-9b99-9a72563ae951; gr_session_id_ade9dc5496ada31e_403a8292-7b51-43ba-9b99-9a72563ae951=true; Hm_lpvt_bc864c0a0574a7cabe6b36d53206fb69=1647935850`,
            "Host": "webssl.xports.cn",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55",
        }
    }, (error, response, body) => {
        error && setLog(error)
        const res = JSON.parse(body)
        if(res && res.error === 0){
          resolve(res)
        }else{
          setLog(res.message)
          reject(res.message)
        }
      })
    })
  }
  /**
 * 推送企业微信
 * @param {*} msg 
 */
  sendWebhook(msg){
    // 执行后端逻辑代码
    var url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=a246870d-e542-4956-bbac-720d7b168975'
    axios.post(url, {
        msgtype: 'text',
        text: {
            'content': `${msg}\n`,
            'mentioned_list': '@all'
        }
    })
  }
  /**
   * 推送钉钉
   * @param {*} content 
   */
  sendDingDing(content) {
    const dingdingUrl = 'https://oapi.dingtalk.com/robot/send?access_token=5f96a8a759bb8c24eae2437a5c687ff2f04efb9fb3cdb3197a8a54df577a6f2a'
    const secret = 'SECd019fa6a21d1c6ca50aa51dbc48471d6faa5c572e16f40bb019d0275b0b13637'

    const timestamp = new Date().getTime()
    const stringToSign = timestamp + '\n' + secret
    const base = crypto.createHmac('sha256',secret).update(stringToSign).digest('base64')
    const sing = encodeURIComponent(base);
    const dingdingStr = dingdingUrl + `&timestamp=${timestamp}&sign=${sing}`
    
    const data = {
      // "msgtype": "text",
      // "text": {
      //   "content":content
      // }, 
      "msgtype": "markdown",
      "markdown": {
          "title": "您抢到了，快去付款",
          "text": content
      },
      "at":{
        "atMobiles":["13161949198"],
        "isAtAll":true
      }
    }
    axios.post(dingdingStr, data).then((res) => {
        if(res.status == 200) {
            console.log('推送钉钉成功！')
        }
    })
  }
}

module.exports = Commit