var express =require('express');
var mymongoClient=require('./mymongo');
var app=express();

app.use(express.static('public'));

app.set('view engine','jade');
/*mymongoClient.insert('user',{'userName':'Leo'},function(){
    console.log(1);
})*/
app.get('/',function(req,res){
    res.render('visitor');
});
app.get('/login',function(req,res){
    var data=req.query;
    var dataSend={};
    dataSend.userName=data.userName;
    mymongoClient.find('user',dataSend,function(docs){
        if(docs.length){
            mymongoClient.find('user',data,function(docs){
                if(docs.length){
                    res.redirect('/pass?userName='+data.userName);
                }else{
                    console.log('密码错误');
                    res.redirect('/');
                }
            })
            
        }else{
            console.log('账号未注册');
            res.redirect('/');
        }
    });
})

app.get('/pass',function(req,res){
    var user=req.query;
    res.render('user',{data:user});
});
app.get('/regist',function(req,res){
    res.render('regist');
})
app.get('/registing',function(req,res){
    var data=req.query;
    var dataSend={};
    dataSend.userName=data.userName;
    mymongoClient.find('user',dataSend,function(docs){
        if(!docs.length){
            mymongoClient.insert('user',data,function(){
                console.log('注册成功');
                res.redirect('/');
            });
        }else{
            console.log('该账号已存在');
            res.redirect('/');
        }
    });
    
});
app.listen(8080,function(){
    console.log('服务器已启动!');
});