

#### 复制对象的方法
JSON.parse(JSON.stringify())
Object.create()

#### 使用while实现无限循环
```javascript 
function sleep(sec){
	return new Promise((resolve)=>{
		setTimeout(resolve, sec)
	})
}
async function* counter(){
	let i = 0;
	while(true){
		await sleep(1000);
		yield i++;
	}
}
(async function(){
	for await(let v of counter()){
		console.log(v)
	}
})()
```

## async的异步编程
+ callback
存在嵌套地狱的缺陷
+ Promise
使用链式代替了嵌套
Promise中可以使用setTimeout，等待一定时间执行
可以添加事件，此时需要事件发生才resolve()
+ async/await
语法层面的改进，等待一个promise结束
+ generator
使用yield模拟async方法，generator 遇到 yield 会停下来
async generator、for await of：generator 中也可以返回一个异步遍历器，可以用for await of去遍历