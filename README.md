<!--
 * @Description: 
 * @Autor: zwcong
 * @Date: 2022-04-12 11:18:16
 * @LastEditors: zwcong
 * @LastEditTime: 2022-04-21 19:05:26
-->
# tty-tyg
天通苑体育馆-羽毛球


## 运行
`npm run start`




## 使用 
<!-- tiantong.getEffectiveSit('20220417', 28, 32, 1) // 指定日期，开始时间，结束时间, 场地最小数量 -->

## 配置信息

```
task.scheduleSeconds = 1   // 每隔几秒开始定时任务
task.date = '20220425'      // 抢场地的日期
task.startTime = 34         // 抢场地的开始时间，需要*2
task.endTime = 35           // 抢场地的结束时间，需要*2
task.block = 1              // 抢场地的块数（小时数）同一块场地
```

`注：cookie 修改，在config.json中配置`

`注：指定时间需要*2，如抢下午14点到16点的场地要，传28，32`
