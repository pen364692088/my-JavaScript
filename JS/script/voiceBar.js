window.onload=function(){
	var oBall=document.getElementsByClassName("voice_ball_width")[0];
 		var oLine=document.getElementsByClassName("voice_line_width")[0];
 		var oBox=document.getElementsByClassName("voice_box_width")[0];
 		var oMusic=document.getElementById("music");
 		/*var oP=oLine.getElementsByTagName("p")[0];*/

 		var left=oLine.offsetLeft+oBox.offsetLeft+oBall.offsetLeft-oBall.offsetWidth/2-oBox.offsetWidth/2;
 		var old_x=left;
 		var Line_width=Number(oLine.offsetWidth);
 		var num=1;
 		var Right=oLine.offsetLeft+oBox.offsetLeft+oBall.offsetLeft-oBox.offsetWidth/2+oBall.offsetWidth/2;

 		/*console.log("line的从属左边距: "+oLine.offsetLeft,"box的从属左边距: "+oBox.offsetLeft,"ball的从属左边距: "+oBall.offsetLeft,"line的宽度: "+oLine.offsetWidth);*/
 		
 		oLine.onclick=function(event){
 			var x=event.clientX;
 			console.log(x);
 			console.log(Right);
 			var turn=Right-x;
 			if((turn<=2)){
 				turn=0;
 			}
 			if(turn>=Line_width-oBall.offsetWidth-5){
 				turn=Line_width-oBall.offsetWidth;
 			}
 			num=1-(turn)/(oLine.offsetWidth-oBall.offsetWidth);
 			// oP.innerHTML=num*100+"%";
 			console.log(turn);
 			oBall.style.right=turn+"px";
 			/*alert(oLine.offsetWidth);*/
 			oMusic.volume=num;
 		}
 		oMusic.volume=num;
}