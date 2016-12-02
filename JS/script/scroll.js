    
    $(document).ready(function(){

        $(function(){
        $('#dowebok').fullpage({
        sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90',"#F00"],//背景颜色
        'navigation': true,//开启导航栏
         "resize":true,  //字体是否随着窗口改变
         "navigationPosition":"left", //导航栏的位置
         'anchors':,
    	})
    	$(window).resize(function(){
            autoScrolling();
        });
    	function autoScrolling(){
            var $ww = $(window).width();
            if($ww < 800){
                $.fn.fullpage.setAutoScrolling(false); //当浏览器宽度小于800的时候不再响应式收缩
            } else {
                $.fn.fullpage.setAutoScrolling(true);
            }
        }
        autoScrolling();

    	})	
        
    }
	