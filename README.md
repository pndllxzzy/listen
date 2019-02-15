# listen
监听多事件

### 用法
```
const L = require('./index.js')
const listen = new L()

listen.listenOnce(['event1', 'event2'], function(){
  console.log('event1 event2 run')
})

listen.listenOnce(['event1', 'event3'], function(){
  console.log('event1 event3 run')
})

setTimeout(()=>{
  L.ready(['event2', 'event3'])
  console.log('event2 event3 ready')
}, 1000)

setTimeout(()=>{
  L.ready(['event1'])
  console.log('event1 ready')
}, 2000)

```

### API

#### listen(eventNames, function) 事件都触发后执行函数
eventNames String|Array<String> 事件名称或者事件名称数组，如果为数组则数组内事件都触发后执行参数中的函数
function   Function             事件触发后执行的函数

#### listenOnce(eventNames, function) 事件都触发后执行函数，且函数只执行一次
eventNames String|Array<String> 事件名称或者事件名称数组，如果为数组则数组内事件都触发后执行参数中的函数
function   Function             事件触发后执行的函数

#### ready(eventNames)  触发事件
eventNames String|Array<String> 事件名称或者事件名称数组
  
