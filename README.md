<!--
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-04-12 11:18:16
 * @LastEditors: zwcong
 * @LastEditTime: 2024-06-28 15:43:44
-->
# tty-tyg
天通苑体育馆-羽毛球


## 运行
`npm run start`

```

## 配置信息

```
// cookie
task.JSESSIONID = 'EAFF15EE85BBBE251C155DB0D6382E11'

// 配置信息
task.scheduleSeconds = 5   // 每隔几秒开始定时任务
task.date = '20240702'      // 抢场地的日期
task.startTime = 40         // 抢场地的开始时间，需要*2
task.endTime = 44           // 抢场地的结束时间，需要*2
task.block = 1              // 抢场地的块数（小时数）同一块场地

task.scheduleStartTime = '2024-04-23 07:59:00' //定时开始时间
task.scheduleStartEnd = '2024-04-23 08:12:00' //定时结束时间

task.reverse = true        //是否倒序（从大号场地开始）

```

`注：number(最多可以抢几块场地) 修改，在config.json中配置`

`注：指定时间需要*2，如抢下午14点到16点的场地要，传28，32`
