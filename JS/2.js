var express= require("express");
var fs = require("fs");
var app = express();
app.use(express.static("public"));
/*app.get("/message",function(req,res){
	var message= req.query.name;
	fs.writeFile('/message.txt', message, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
});
})*/
app.get("/message",function(req,res){
	var name = req.query.name;
	var password = req.query.password;
	if(name=== "123" && password === "abc"){
		res.send("成功");
	}else{
		res.send("失败");
	}

})
app.post("/message",function(req,res){
	res.send("登录成功")
})
app.listen(80,function(){
	console.log("服务器已启动!");
})