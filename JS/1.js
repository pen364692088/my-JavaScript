var express = require("express"); //引用模块
var app = express(); //app为express的对象
//app.use(express.static("./public"));  //调用app里的use方法(传入参数 模块里的函数(设置public为静态网页目录))
app.get("/index.html",function(req,res){
   res.send("hello");
})
app.listen(80,function(){
	console.log("服务器已启动....");
}); //监听端口

