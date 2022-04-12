/*
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-03-22 16:05:13
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-12 08:03:33
 */

const request = require("request");
const axios = require("axios");

const url = 'https://webssl.xports.cn/aisports-weixin/court/commit'

let count = 0

function commit(data, JSESSIONID){
  // data = data.splice(0, 1)
  data.forEach(async (item)=>{
    if(count <= 2){
      let msg = ''
      try{
        const res = await submit(item, JSESSIONID)
        msg = `提醒：恭喜恭喜，您抢到了${res.trade.tradeDesc}`
        count ++
        console.log(msg)
      }catch(err){
        console.log(`未抢到${item.date}, ${err}`)
      }
      // sendWebhook(msg)
    }else{
      console.log('抢太多场地了，给别人留点吧')
    }
  })

  
}
function submit(item, JSESSIONID){
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
          "Cookie": `JSESSIONID=${JSESSIONID}; Hm_lvt_bc864c0a0574a7cabe6b36d53206fb69=1647918203; gr_user_id=e6a7ae84-38f7-472d-9cee-13589338970e; gr_session_id_ade9dc5496ada31e=403a8292-7b51-43ba-9b99-9a72563ae951; gr_session_id_ade9dc5496ada31e_403a8292-7b51-43ba-9b99-9a72563ae951=true; Hm_lpvt_bc864c0a0574a7cabe6b36d53206fb69=1647935850`,
          "Host": "webssl.xports.cn",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55",
      }
  }, (error, response, body) => {
      console.log('error', error)
      console.log('body', body)
      const res = JSON.parse(body)
      if(res && res.error === 0){
        resolve(res)
      }else{
        reject(res.message)
      }
    })
  })
}

/**
 * 推送企业微信
 * @param {*} msg 
 */
 function sendWebhook(msg){
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

module.exports = commit