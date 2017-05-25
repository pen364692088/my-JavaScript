window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        var audioContext=new window.AudioContext();
        var source=null;
        var audioBuffer=null;
        var canvasX=500;
        var canvasY=200;
        var analyser =null;
        var gain = audioContext.createGain();
        var xhr=null;
        var startOffset=0;
        var startTime=0;
        var restar=1;

        var canvas=document.querySelector('canvas');
        var canvasContext=canvas.getContext("2d");
        var canvasLineColor='#4ce1ab';

        function loadAudioFile(url) {
            source=null;
            xhr = new XMLHttpRequest(); //通过XHR下载音频文件
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) { //下载完成
                initSound(this.response);
            };
            xhr.send();
        }
        function initSound(arrayBuffer) {
            audioContext.decodeAudioData(arrayBuffer, function(buffer) { //解码成功时的回调函数
                audioBuffer = buffer;
                playSound();
            }, function(e) { //解码出错时的回调函数
                console.log('Error decoding file', e);
            });
        }
        /**************************************播放****************************************/
        function playSound() {
            source = audioContext.createBufferSource();
            analyser= audioContext.createAnalyser();
            source.buffer = audioBuffer;
            /*source.loop = false; */
            //console.log(source);
            source.connect(gain);
            gain.connect(analyser);

            if(restar){
                startTime = Date.now();       
                source.start(0,0.6); 
                console.log('新歌');
            }else{
                startTime = Date.now() - startOffset;
                console.log('startTime:'+startTime+'startOffset:'+startOffset/1000);
                source.start(0,(startOffset / 1000));
                console.log('继续');
            }
            /*analyser.connect(audioContext.destination);*/
           // //立即播放
            //立即播放
            draw(analyser);
            gain.gain.value=1;
        }
        /**************************************停止****************************************/
        function stopSound(){
            if(source){
                source.stop(0);
                console.log('停止');
                startOffset=0;
                startTime=0;
                restar=1;
            }
            //立即停止

        }
        /**************************************暂停****************************************/
        function pauseSound(){
            if(source){
                source.stop(0);
                console.log(startOffset);
                startOffset=Date.now()-startTime+1.7;
                restar=0;
            }
            //暂停
        }
        
        /**************************************获得频率数据****************************************/
        function draw(analyser){
            setInterval(function(){
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array); //获得频率数据
                canvasDraw(makeEasy(array));
            },40);
            
        }
        /**************************************canvas绘制****************************************/
       function canvasDraw(array){
            canvasContext.clearRect(0,0,canvasX,canvasY); 
            var step=10;
            var x=10;
            canvasContext.fillStyle=canvasLineColor;
            for(var i=0;i<array.length;i++){
                canvasContext.fillRect(x+i*step,150,5,-array[i]/2);
            }
        }
        /**************************************简化频谱数据****************************************/
        function makeEasy(array){
            var newArray=[];
            var len=array.length-400;
            for(var i=0;i<len;i+=12){
                newArray.push(array[i]);
            }
            return newArray;
        }