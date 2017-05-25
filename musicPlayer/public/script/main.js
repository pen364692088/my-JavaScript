window.onload = function() {
    //业务逻辑
    /*****************************************自定义选择器*************************************/
    function $(obj) {
        if (document.querySelector(obj)) {
            return (document.querySelectorAll(obj).length > 1 ? document.querySelectorAll(obj) : document.querySelector(obj));
        } else {
            return false;
        }

    }
    /*****************************************延时函数*************************************/
    function delay(time_ms) {
        var now = new Date();
        now = now.getTime();
        var next = now + time;
        while (next > now) {
            now = new Date();
            if (now.getTime >= next) {
                return true;
            }
        }

    }
    /*****************************************获取绝对位置*************************************/
    function getPosition(obj) {
        var position = [0, 0];
        while (obj.offsetParent != null) {
            position[0] += obj.offsetLeft;
            position[1] += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return position;
    }
    /*****************************************检测拖动-兼容版(开发中)*************************************/
    function dragTest(obj, dirction = y, callback1, callback2, callback3) {
        v
        var dir = null;
        switch (dirction) {
            case 'x':
                dir = x;
                break;
            case 'y':
                dir = y;
                break;
        }
        var parent = obj.parentNode;
        var parentPos = getPosition(parent);
        obj.onmousedown = function(event) {
            obj.keyup = 0;
            var before = event['client' + dir];

            obj.onmousemove = function(event) {

            }
        }
    }
    /************************************** 获取样式数值****************************************/
    function getStyle(obj, attr) {
        return parseInt(getComputedStyle(obj)[attr] ? getComputedStyle(obj)[attr] : obj.currentStyle[attr]);
    }
    /************************************** 歌词移动****************************************/
    function oLyricsMove() {
        clearInterval(oLyricsMove.TopTimer);
        var time = musicSelf.duration;
        var nowTime = musicSelf.currentTime;
        var ratio = nowTime / time;
        var Height = getStyle(oLyrics, 'height');
        console.log(Height);
        oLyrics.TopTimer = setInterval(function() {
            /*console.log(oLyrics.style.top);*/
            Height = getStyle(oLyrics, 'height');
            time = musicSelf.duration;
            nowTime = musicSelf.currentTime;
            ratio = nowTime / time;
            oLyrics.style.top = -ratio * Height + 'px';

        }, 100);
        return false;
    }
    //界面逻辑
    //播放事件
    var oRecord = $('.record');
    var oRecordImg = oRecord.querySelector("img");
    var oRecordCtrl = $('.ctrl');
    var oPlayBtn = $('.playBtn');
    var oPlayBtnImg = $('.playBtn use');
    var musicSelf = $('audio')[0];
    var oDownloadSrc = $('.downloadSrc');
    var loop = 0;
    console.log(getPosition($('.volumeBall')));
    /*console.log(musicSelf);*/
    var nowAPIsrc = '';

    /************************************** 唱片的动画效果****************************************/
    function oRecordMove() {
        clearTimeout(oRecord.timer);
        /*if(!apion){
             stopSound();
             loadAudioFile(musicSelf.getAttribute('src'));
             nowAPIsrc=musicSelf.getAttribute('src');
             apion=1;       
        }*/
        if (!musicSelf.paused) {
            oRecordCtrl.className = "ctrl";
            oRecordImg.className = "";
            oPlayBtnImg.setAttribute('xlink:href', "#icon-zanting");
            musicPlay();
        } else {
            oRecordCtrl.className = "ctrl recordCtrl-active";

            oRecord.timer = setTimeout(function() {
                oRecordImg.className = "recordImg-active";
                musicPlay();
                oPlayBtnImg.setAttribute('xlink:href', "#icon-crm17");
            }, 1000);

        }
        Loop();
    }
    var musicTurn = null;

    function apiChangeMusic() {
        nowAPIsrc = musicSelf.getAttribute('src');
        loadAudioFile(musicSelf.getAttribute('src'));
    }
    /************************************** 播放函数****************************************/
    function musicPlay() {

        if (musicSelf.paused) {
            clearInterval(musicTurn);
            musicPlayTime = setTimeout(function() {
                musicSelf.play();
                oLyrics.innerHTML=oLyricsList[getNowIndex()];
            }, 1000);
            if (musicSelf.getAttribute('src') != nowAPIsrc) {
                stopSound();
                nowAPIsrc = musicSelf.getAttribute('src');
                loadAudioFile(musicSelf.getAttribute('src'));
                
            } else {
                pauseSound();
                loadAudioFile(musicSelf.getAttribute('src'));
                nowAPIsrc = musicSelf.getAttribute('src');
                
            }
            oDownloadSrc.href = musicSelf.src;
            musicTurn = setInterval(function() {
                /*console.log(musicSelf.ended);*/
                if (musicSelf.ended == true) {
                    turnLastNext(0);
                }
            }, 2000);
        } else {
            clearInterval(musicTurn);
            musicSelf.pause();
            pauseSound();
        }
    }
    /************************************** 单曲循环函数****************************************/
    function Loop() {
        musicSelf.loop = loop;
    }
    oRecord.onclick = oRecordMove;
    oRecordCtrl.onclick = oRecordMove;
    oPlayBtn.onclick = oRecordMove;
    //下载按钮
    oDownloadSrc.href = musicSelf.src;
    var oDownBtn = $('.download');
    /************************************** 下载****************************************/
    oDownBtn.onclick = function() {
        console.log(musicSelf.src);
        oDownloadSrc.href = musicSelf.src;

    }

    //音量调节
    var oVolumeCtrl = $('.volume');
    var oMusicSwitch = $('.musicSwitch');
    var oVolumeBar = $('.volumeBar');
    var oVolumeBall = $('.volumeBall');
    var oVolumeLine = $('.volumeBarLine');
    /************************************** 音量调节****************************************/
    oVolumeCtrl.onclick = function() {
        oVolumeBar.className = oVolumeBar.className == "volumeBar" ? "volumeBar volumeBar-acitve" : "volumeBar";
    }
    console.log(getPosition(oVolumeCtrl));
    /************************************** 音量拖动****************************************/
    oVolumeBall.onmousedown = function() {
        oVolumeBall.keyup = 0;
        oVolumeBall.onmousemove = function(event) {
            if (!oVolumeBall.keyup) {

                var ballY = event.offsetY;
                var ballHeight = getStyle(oVolumeBall, 'height');
                var nowTop = getStyle(oVolumeBall, 'top');
                var max = getStyle(oVolumeLine, 'height') - ballHeight * 2 / 3;
                nowTop = nowTop + ballY - ballHeight / 2;

                if (nowTop <= 0) {
                    nowTop = 0;
                }
                if (nowTop > max) {
                    nowTop = max;

                }
                oVolumeBall.style.top = nowTop + 'px';
                var volumeNum = 1 - nowTop / max;
                musicSelf.volume = volumeNum;
                /*console.log(volumeNum);*/
            }

        }
        document.onmouseup = function() {
            oVolumeBall.keyup = 1;
            oVolumeBall.onmousemov = document.onmouseup = null;
        }
        return false;
    }

    /*console.log(getStyle(oVolumeLine,'height'));*/
    //界面点击事件
    /*window.onmousedown=function(event){
        if(oVolumeBall.keyup==1&&event.target!=oVolumeCtrl){
            oVolumeBar.className="volumeBar";
        }
        return false;
    }*/
    //歌词事件

    var oLyrics = $('.lyrics p');
    var oLyricsImg = $('.lyrics>img');
    console.log(oLyrics);
    oLyrics.on = 1;
    oLyrics.timer = setInterval(function() {
        if (!musicSelf.paused && oLyrics.on) {
            oLyrics.on = 0;
            console.log(1);
            oLyricsMove();
        }
    }, 100);
    var oLyricsList=["<br/>決めつけばかり 自惚れを着た<br/>一味强词夺理 总是妄自尊大<br/>チープなhokoriで 音荒げても<br/>尽管胡乱叫喊着 自己那廉价的自尊心<br/>棚に隠した 哀れな 恥に濡れた鏡の中<br/>不过藏身于隔板背后 被可悲之耻濡湿的镜中<br/>都合の傷だけひけらかして<br/>能炫耀的也只有显露的伤口<br/>手軽な強さで勝取る術を<br/>再如何磨练轻易取胜的技巧<br/>どれだけ磨いでも気はやつれる<br/>锐气早已受挫锋芒不再<br/>ふらついた思想通りだ<br/>正如内心犹豫不决的想法<br/>愛-same-CRIER 愛撫-save-LIAR<br/>爱依然在哭泣 安慰拯救谎言<br/>Eid-聖-Rising HELL<br/>神圣誓约铸造地狱<br/>愛してる Game世界のDay<br/>我深爱的这个世界 却成了游戏般的日常<br/>Don't-生-War Lie-兵士-War-World<br/>不要创造战争 谎言即战争世界的战士<br/>Eyes-Hate-War<br/>我讨厌眼前的战争<br/>A-Z Looser-Krankheit-Was IS das?<br/>A到Z 什么是失败者吗？<br/>Leben, was ist das?<br/>生活是什么？<br/>Signal, Siehst du das?<br/>信号，你看到了吗？<br/>Rade, die du nicht weisst<br/>先生，你不知道<br/>Aus eigenem Willen<br/>自己的自由意志<br/>Leben, was ist das?<br/>生活是什么？<br/>Signal, Siehst du das?<br/>信号，你看到了吗？<br/>Rade, die du nicht weisst<br/>先生，你不知道<br/>Sieh mit deinen Augen<br/>看你的眼睛<br/>",
                    "<br/>丸くて大きなからだ　长いお髭がとても似合ってる <br/>像球一样大的身体 长长的胡子真的很般配 <br/>粉雪が舞い　冻える体を　包んでくれた <br/>粉雪飞舞 包裹住冻僵的身体 <br/><br/>さよならを　いえなくて <br/>再见 说不出口 <br/><br/>一绪に駆け抜けた时间は　いつも私が置いてけぼりで <br/>一起度过的时间 一直把我扔下不管 <br/>猫のくせにって　しっぽを振りながら　笑ってた　君 <br/>明明是只猫 边摇着尾巴 笑了的 你 <br/><br/>优しさを　ありがとう <br/>谢谢 你给与我的温柔 <br/><br/>二つの手を重ねる　あぁ　喧騒の中 <br/>重叠起双手 啊啊 在喧嚣之中 <br/>必死で生きてきた　夏のあの日々 <br/>拼命才活到的  夏日的那一天 <br/><br/>いつでもそばにいるよと　そう　君がくれた <br/>会一直在你身边的哦 是啊 你所给予我的 <br/>やわらかな存在　深く大きな瞳　まっすぐな眼差しを <br/>柔软的存在 大大的深邃的眼睛 率直的视线 <br/><br/><br/>もう一绪には走れない　君の颜も霞んで　见えない <br/>已经不能在一起奔跑了 你的脸也 模糊得看不到了 <br/>いつか教えてくれた　生きる意味　信じているから <br/>一直相信着 你何时曾教过我的 生存的意义  <br/><br/>雪道が赤く染まる　ただ　暖かくて <br/>被雪覆盖的小路被染上赤红  仅剩 温暖 <br/>続くはずのない　暗暗の孤独 <br/>黑暗的孤独 应该也不会再继续了 <br/>最期の愿いと思い　この手で抱きしめ <br/>用这双手抱住 临终的愿望和思绪 <br/>几千の消えた　愿いを胸に抱き　爱する君の血になる <br/>在怀中留住无数消逝的愿望 成为深爱的你的血液",
                    "谁もいない花畑 今も返事がなくて<br/>谁也不在的花圃至今也没有回答 <br/>见惯れた景色でも寂しがる 頬赤く染めて<br/>见惯的景色也寂寞面颊染红 <br/>仆の隠した大事なものを 贵女ははじめから気付いてて<br/>我的隐藏了的重要的东西贵女从一开始就已经注意到 <br/>いつの间にか溢れてたよ 贵女が萃めた想い<br/>什么时候的回想吗溢出了贵女所萃觉醒的思念<br/>青空泳ぐ云动かして 贵女の笑颜作ったら<br/>青空游泳的云动。贵女的笑颜做的话<br/>崩れないで 风が运ぶ 涙误魔化す雨降れ <br/>不风崩溃有运选误魔化为雨下的眼泪<br/>逆さに踊る夏祭り 小さな花を揺らす<br/>颠倒的跳舞的夏日祭小的花朵摇曳着<br/>寝転ぶ仆に邪魔して笑う 頬赤く染めて<br/>横卧我打扰了笑的面颊染红<br/>目覚めた后の虚しさ余所に 打ち上がる华は梦と同じ<br/>醒来的后的空虚升起的华是梦一样<br/>いつの间にか溢れてたよ 贵女に萃めた想い<br/>什么时候的回想吗溢出了贵女中萃觉醒的思念<br/>流れる雫 光る夜空に 仆の愿いを并べても<br/>流动的雫闪耀的夜空我的愿并也敌。<br/>叶わないで 月が渗む 涙照らす光差せ<br/>不叶わ月渗翻滚的眼泪光差せ照亮<br/>青空泳ぐ云动かして 贵女の笑颜作ったら<br/>青空游泳的云动。贵女的笑颜做的话<br/>崩れないで 风が运ぶ 涙误魔化す雨降れ<br/>不风崩溃有运选误魔化为雨下的眼泪<br/>流れる雫 光る夜空に 仆の愿いを并べても<br/>流动的雫闪耀的夜空我的愿并也敌。<br/>叶わないで 月が渗む 涙照らす光差せ<br/>不叶わ月渗翻滚的眼泪光差せ照亮",
                    "oblivious<br/>词曲编曲：梶浦由记<br/>演唱：Kalafina<br/>Kalafina-oblivious<br/>本とは空を飞べると知っていたから<br/>正因为知道可以在空中翱翔<br/>羽ばたくときが怖くて风を忘れた<br/>才会畏惧展翅的那一刻而忘却疾风<br/>oblivious　何処へ行くの<br/>oblivious 去向何方<br/>远くに见えるあの蜃気楼<br/>远处可见的那海市蜃楼<br/>いつか怯えながら<br/>畏惧于那将会来到的某一天<br/>二人の未来を映して<br/>映照出两人的未来 <br/>よるべない心二つ寄り添う顷に<br/>当毫无寄托的两颗心紧挨之时<br/>本当の悲しみがほら翼広げて<br/>真正的悲伤开始展翅翱翔<br/>oblivious　夜の中で<br/>oblivious 仿佛在暗夜中<br/>真昼の影を梦见るように<br/>梦见了白画之影<br/>きっと堕ちて行こう　光へ<br/>一定就此坠落吧 向着那光芒 <br/>いつか　君と　二人<br/>总有一天将与你两个人<br/>夜を　朝を　昼を　星を　幻想(ゆめ)を<br/>共鉴明月 共赏晨曦 共沐日光 共览星辰 共织幻想<br/>夏を　冬を　时を　风を<br/>共游炎夏 共御寒冬 共度时光 共拂清风<br/>水を　土を　空を<br/>共戏流水 共踏尘土 共翔天空<br/>we go further in the destiny……<br/>oblivious 侧にいてね<br/>oblivious 请陪在我身边<br/>静かな恋がほら始まるよ<br/>寂静的恋情即将开始<br/>いつか震えながら<br/>有朝一日将一同颤抖着<br/>二人の未来へ<br/>迎来两人的未来<br/>oblivious 何処へ行くの<br/>oblivios 去向何方<br/>远くへ逃げてゆく水の中<br/>向远方流淌而去的流水之中<br/>何て绮丽な声で<br/>如此美丽的声音<br/>二人の未来を <br/>正歌颂着两人的未来",
                    "<br/>secret base～君がくれたもの～ <br/>作词：町田纪彦／作曲：町田纪彦／编曲：虎じろう<br/> <br/>君と夏の终わり 将来の梦<br/>与你在夏末约定 将来的梦想 <br/> <br/>大きな希望 忘れない<br/>远大的希望 不要忘记了<br/>10年后の8月 また出会えるのを 信じて<br/>我相信 十年后的八月 我们还能再相遇<br/>最高の思い出を???<br/>共划美好的回忆...<br/> <br/>出会いは ふっとした 瞬间<br/>相识 是那么不经意的瞬间<br/>帰り道の交差点で<br/>我在回家途中的十字路口 <br/>声をかけてくれたね 「一绪に帰ろう」<br/>听见你的一声“一起回家吧”<br/>仆は 照れくさそうに カバンで颜を隠しながら<br/>我当时有点尴尬 还拿书包遮着脸<br/> <br/>本当は とても とても 嬉しかったよ<br/>其实我 心里好高兴 真的好高兴<br/> <br/>あぁ 花火が夜空 きれいに咲いて ちょっとセツナク<br/>烟火在夜空中 灿烂盛开 几许伤感<br/>あぁ 风が时间とともに 流れる<br/>啊！风随着时光 流逝<br/> <br/>嬉しくって 楽しくって 冒険も いろいろしたね<br/>满心欢喜的 兴致冲冲地 我们四处探险<br/>二人の 秘密の 基地の中<br/>就在我们的 秘密基地中<br/>君と夏の终わり 将来の梦 大きな希望 忘れない<br/>与你在夏末约定 将来的梦想 远大的希望 勿忘记<br/>10年后の8月 また出会えるのを 信じて<br/>我相信 十年后的八月 我们还能再相遇<br/>君が最后まで 心から 「ありがとう」叫んでいたこと 知っていたよ<br/>我知道 一直到最后 你仍在心底呼喊着“谢谢你”<br/>涙をこらえて 笑颜でさようなら せつないよね<br/>强忍着泪水 笑着说再见 无限感叹涌现<br/>最高の思い出を???<br/>那一段最美好的回忆....<br/> <br/>あぁ 夏休みも あと少しで 终わっちゃうから<br/>啊！暑假就快要过完了<br/>あぁ 太阳と月 仲良くして<br/>啊！太阳和月亮 默契十足<br/> <br/>悲しくって 寂しくって 喧哗も いろいろしたね<br/>想到令人悲伤 或许有些寂寥 我们也多有争吵<br/>二人の 秘密の 基地の中<br/>就在我们的 秘密基地中<br/> <br/>君が最后まで 心から 「ありがとう」 叫んでいたこと 知っていたよ<br/>我知道 一直到最后 你仍在心底呼喊“谢谢你”<br/>涙をこらえて 笑颜でさようなら せつないよね<br/>强忍着泪水 笑着说再见 无限感叹涌现<br/>最高の思い出を???<br/>那一段最美好的回忆...<br/>突然の 転校で どうしようもなく<br/>你突然 要转学 你我都可奈何<br/>手纸 书くよ<br/>我会写信给你<br/> <br/>电话もするよ <br/>也会打电话给你<br/>忘れないでね<br/>千万不要忘记我<br/>仆のことを<br/>永远别忘记<br/>いつまでも 二人の 基地の中<br/> 那段在秘密基地中的日子<br/>君と夏の终わり ずっと话して 夕日を见てから星を眺め<br/>与你在夏末 聊了这么多 从黄昏到繁星点点<br/>君の頬を 流れた涙は ずっと忘れない<br/>流过你双颊的泪水 我永远不会忘记<br/>君が最后まで 大きく手を振ってくれたこと きっと忘れない<br/>直到最后 你紧紧握住我的手 这感觉也将长在我心中<br/>だから こうして 梦の中で ずっと永远に???<br/>于是就这样 让我们在梦中相会吧 永远的...<br/>君と夏の终わり<br/>与你在夏末约定<br/>将来の梦 大きな希望 忘れない<br/>将来的梦想 远大的希望 勿忘记<br/>10年后の8月 また出会えるのを 信じて<br/>我相信 十年后的八月 我们还能再相遇<br/>君が最后まで 心から 「ありがとう」 叫んでいたこと 知っていたよ<br/>我知道 一直到最后 你仍在心底呼喊着“谢谢你”<br/>涙をこらえて 笑颜でさようなら せつないよね<br/>强忍着泪水 笑着说再见 无限感叹涌现<br/>最高の思い出を???<br/>那一段最美好的回忆...<br/>最高の思い出を???<br/>那一段最美好的回忆...",
                    "<br/>蛍<br/>梅雨の真ん中<br/>梅雨季时已至深<br/>今日は雨上がり<br/>今天雨过天晴<br/>生温かい风<br/>温柔吹拂的风<br/>静かな夜道を  通り抜ける<br/>想要穿过 夜里寂静的街道<br/>夏が近い<br/>夏季越来越近了……<br/>+<br/>光り辉き<br/>光芒闪耀<br/>この目を夺い<br/>夺去这双眼的视线<br/>手にしたくなる<br/>伸出手<br/>触れてみたくなる<br/>想触碰<br/>あなたはこの蛍のよう<br/>你便是那萤火虫<br/>+<br/>もういいかい   まだみたい<br/>想再一次  见到你<br/>もういいかい   この心<br/>想再一次 这颗心<br/>+<br/>あなたの気持が见えない<br/>看不见你的心情<br/>望むほど苦しくなる<br/>越期望也越痛苦<br/>それでも嫌いになれない<br/>但即便如此也无法讨厌你<br/>+<br/>ふわりふわりと<br/>飘舞着的……<br/>宙（ちゅう）に舞う蛍<br/>在空中飞舞的萤火虫<br/>少し离れた场所から<br/>离这里并不遥远的地方<br/>见るのが一番いい<br/>是我所见过最漂亮的地方<br/>そっとそっと<br/>轻轻地……<br/>+<br/>つかめない   届かない<br/>想抓住 却抓不到<br/>つかめない   その心<br/>想抓住  这颗心<br/>+<br/>自分だけが思っている<br/>曾经想过自己就是唯一<br/>感じると泣きたくなる<br/>但还是感到想哭泣<br/>同じ気持ちにはなれない<br/>不习惯这相同的心情<br/>+<br/>もういいかい   まだみたい<br/>想再一次 见到你<br/>もういいかい   この心<br/>想再一次 这份心意<br/>+<br/>あなたの気持が见えない<br/>看不见你的心情<br/>望むほど苦しくなる<br/>越期望也越痛苦<br/>それでも嫌いになれない<br/>但即便如此也无法讨厌你<br/>+<br/>自分だけが思っている<br/>曾经想过自己就是唯一<br/>感じると泣きたくなる<br/>但还是感到想哭泣<br/>あなたの気持ちが知りたい<br/>想知道你的心情<br/>あなたの気持ちが见えない<br/>想看见你的心情<br/>和音：（梅雨の真ん中 今日は雨上がり<br/>生温かい风静かな夜道を）<br/>梅雨季时已至深 今天雨过天晴<br/>温柔吹拂的风 吹过夜里寂静的街道<br/>それでも嫌いになれない<br/>即便如此也无法讨厌你<br/>和音：（光り辉き この目を夺い<br/>手にしたくなる触れてみたい）<br/>光芒闪耀 夺去这双眼的视线<br/>和音：（今日は雨上がり）<br/>今天雨过天晴<br/>夏が近い<br/>夏季越来越近了……<br/>END",
                    "纯音乐 无歌词",
                    "『さくら さくら 会いたいよ いやだ 君に今すぐ会いたいよ』 <br/>樱花，樱花，想见你，不要嘛，现在就想要见你  <br/>だいじょうぶ もう泣かないで 私は风 あなたを包んでいるよ <br/>没关系，不要再哭了，我是风，正包围在你的身边。 <br/>『さくら さくら 会いたいよ いやだ 君に今すぐ会いたいよ』 <br/>樱花，樱花，想见你，不要嘛，现在就想要见你  <br/>ありがとう ずっと大好き 私は星 あなたを见守り続ける※ <br/>谢谢，一直都最喜欢你，我是星星，会永远看着你守护着你。 <br/>あなたに出会えてよかった 本当に本当によかった <br/>和你认识真好，真的真的是很好很好。<br/>ここにもういれなくなっちゃった もう行かなくちゃ ホントゴメンね <br/>已经不能在这里了，已经不走不行了，真的对不起。<br/>私はもう一人で远いところに行かなくちゃ <br/>我已经必须一个人要到远方去（不走不行）。<br/>どこへ?って闻かないで なんで?って闻かないで ホントゴメンね <br/>到哪里？不要问好吗？ 为什么？不要问好吗？真的对不起。 <br/>私はもうあなたのそばにいられなくなったの <br/>我已经不能再在你的身边了。<br/>いつもの散歩道 桜并木を抜けてゆき <br/>总是在散步道，樱花树并排的地方慢慢远去。<br/>よく游んだ川面の上の 空の光る方へと <br/>经常游戏的河面上的天空的光的方向去。 <br/>もう会えなくなるけど 寂しいけど 平気だよ <br/>虽然已经不能见面了，虽然孤独，但是不要紧。 <br/>生まれてよかった ホントよかった あなたに出会ってよかった <br/>出生真好，真的很好，和你遇见真的很好。 <br/>(※くり返し) <br/>あなたに出会えてよかった 本当に本当によかった <br/>和你遇见真的很好，真的真的很好。<br/>あなたの帰りを待つ午后 あなたの足音 何げないこと <br/>等你归来的午后，你的足音，不形于色的事情（不能告诉别人只有自己知道的事情） <br/>私はそう、一番の喜びを知りました <br/>对我来说的，（知道了）是最开心的事情。 <br/>あなたが话してくれたこと 一日のこと いろいろなこと <br/>你对我说的话，一天的事情，很多的事情。  <br/>私はそう、一番の悲しみも知りました <br/>对我来说的，（知道了）是最悲伤的事情。 <br/>それはあなたの笑颜 あなたの涙 その优しさ <br/>那是你的笑脸，你的泪水，都是你的温柔。<br/>私の名を呼ぶ声 抱き缔める腕 その温もり <br/>叫我名字的声音，抱紧我的手腕，都是你的温暖。<br/>もう触れられないけど 忘れないよ 幸せだよ <br/>虽然已经不能再接触，也不会忘掉，（这是）幸福的事情。<br/>生まれてよかった ホントよかった あなたに出会ってよかった <br/>出生真好，真的很好，能遇见你真好。<br/>『さくら さくら 会いたいよ いやだ 君に今すぐ会いたいよ』 <br/>樱花，樱花，想见你，不要嘛，现在就想要见你 <br/>だいじょうぶだよ ここにいる 私は春 あなたを抱く空 <br/>没关系的，在这里，我是春天，抱着你的天空。 <br/>『さくら さくら 会いたいよ いやだ 君に今すぐ会いたいよ』 <br/>樱花，樱花，想见你，不要嘛，现在就想要见你<br/>ありがとう ずっと大好き 私は鸟 あなたに歌い続ける <br/>谢谢，一直都最喜欢，我是鸟，永远为你唱歌<br/>桜の舞う空の彼方 目を闭じれば心の中 <br/>在樱花满空飞舞的他方，如果闭上眼睛就在心里 <br/>『さくら さくら 会いたいよ いやだ 君に今すぐ会いたいよ』 <br/>樱花，樱花，想见你，不要嘛，现在就想要见你 <br/>いいんだよ 微笑んでごらん 私は花 あなたの指先の花 <br/>可以啊，微笑的看哪，我是花，你指尖上的花<br/>『さくら さくら 会いたいよ いやだ 君に今すぐ会いたいよ』 <br/>樱花，樱花，想见你，不要嘛，现在就想要见你  <br/>ありがとう ずっと大好き 私は爱 あなたの胸に <br/>谢谢，一直最喜欢，我是爱，在你的胸（心）上。<br/>(※くり返し) <br/>あなたに出会えてよかった 本当に本当によかった <br/>和你遇见真好，真的真的很好<br/>本当に本当によかった <br/>真的真的很好.",
                    "月光食堂　<br/>作詞：ぬー　作曲：ぬー　編曲：ぬー　唄：初音ミク　<br/>翻译：26　<br/>君（きみ）が触（ふ）れた白（しろ）と銀（ぎん）の爪先（つめさき）　<br/>ki mi ga fu re ta shi ro to gi n no tsu me sa ki　<br/>你輕觸的那白與銀的指尖　<br/>また揺（ゆ）れた　離（はな）してくれないか　<br/>ma ta yu re ta　ha na shi te ku re na i ka　<br/>仍動搖著　還不願放開手嗎　<br/>右手（みぎて）にスープを　左（ひだり）に星（ほし）の屑（くず）<br/>mi gi te ni su u pu wo　hi da ri ni ho shi no ku zu<br/>右手端湯　左握星屑<br/>愚（おろ）かに緩（ゆる）んだ頬（ほお）に　紅（べに）をさした<br/>o ro ka ni yu ru n da ho o ni　be ni wo sa shi ta<br/>呆怔和緩的臉頰　染上了紅暈<br/>はぐれた気持（きも）ちとこの体（からだ）は<br/>ha gu re ta ki mo chi to ko no ka ra da wa<br/>離散的情感與此身<br/>またここで待（ま）ち合（あ）わせてさ<br/>ma ta ko ko de ma chi a wa se te sa<br/>仍在這裡等待著與你相會啊<br/>移（うつ）ろう季節（きせつ）を一人（ひとり）眺（なが）め<br/>u tsu ro u ki se tsu wo hi to ri na ga me<br/>獨自一人眺望季節移轉<br/>ただ待（ま）てばいいんだ<br/>ta da ma te ba i i n da<br/>單單等候著、也好<br/>お前（まえ）の夜（よる）がやがて終（お）わると<br/>o ma e no yo ru ga ya ga te o wa ru to<br/>你的夜晚不久終將結束<br/>新（あたら）しい朝（あさ）を迎（むか）える<br/>a ta ra shi i a sa wo mu ka e ru<br/>迎向嶄新的朝晨<br/>その次（つぎ）ここに座（すわ）る誰（だれ）かと<br/>so no tsu gi ko ko ni su wa ru da re ka to<br/>直至與那之後坐此的誰人<br/>また出会（であ）える日（ひ）まで<br/>ma ta de a e ru hi ma de<br/>再度相逢之日<br/>君（きみ）が触（ふ）れた白（しろ）と銀（ぎん）の爪先（つめさき）<br/>ki mi ga fu re ta shi ro to gi n no tsu me sa ki<br/>你輕觸的那白與銀的指尖<br/>もう枯（か）れたんだ　離（はな）してくれないか<br/>mo u ka re ta n da　ha na shi te ku re na i ka<br/>已然枯萎　還不願放開手嗎<br/>月（つき）もまだ白（しろ）く清（さや）か光（ひかり）<br/>tsu ki mo ma da shi ro ku sa ya ka hi ka ri<br/>月也尚是皎皎清光<br/>匙（さじ）に移（うつ）る淡（あわ）い影（かげ）<br/>sa ji ni u tsu ru a wa i ka ge<br/>匙中淡淡移影<br/>緩（ゆる）やかにさめた夜（よる）に一人（ひとり）<br/>yu ru ya ka ni sa me ta yo ru ni hi to ri<br/>徐徐冷夜獨自一人<br/>さびしく笑（わら）えれば<br/>sa bi shi ku wa ra e re ba<br/>如此寂寥一笑<br/>隣（となり）に座（すわ）る明日（あす）と踊（おど）ろう<br/>to na ri ni su wa ru a su to o do ro u<br/>與鄰座的明日共舞<br/>眩暈（めまい）とステップでワルツを<br/>me ma i to su te ppu de wa ru tsu wo<br/>暈眩著順拍走步華爾滋<br/>移（うつ）ろう季節（きせつ）と同（おな）じ夜（よる）は<br/>u tsu ro u ki se tsu to o na ji yo ru wa<br/>移轉的季節與今同一夜<br/>はがれ落（お）ちてゆく<br/>ha ga re o chi te yu ku<br/>斑剝凋落而去<br/>君（きみ）がつけた白（しろ）い爪（つめ）の一筋（ひとすじ）<br/>ki mi ga tsu ke ta shi ro i tsu me no hi to su ji<br/>你握住那白皙雙手的一指<br/>なぞれば　消（き）えた<br/>na zo re ba　ki e ta<br/>若於掌中描形　便將消失<br/>染（し）み込（こ）むように　消（き）えた<br/>shi mi ko mu yo u ni　ki e ta<br/>猶若銘刻於心一般　消失無蹤",
                    "月光 词曲：鬼束ちひろ <br/>I am god's child 我是神的孩子 <br/>この腐败した世界に堕とされた 堕入这已腐败的世界中 <br/>How do I live on such a field? 教我如何在这土地上生存？ <br/>こんなもののために生まれたんじゃない 我并非为此而诞生 <br/>突风に埋もれる足取り 埋藏进突然刮起的风中的步伐 <br/>倒れそうになるのを 像是要倒下的样子 <br/>この锁が许さない 这样的联系是不允许的 <br/>心を明け渡したままで 就这样把心都掏空 <br/>贵方の感覚だけが散らばって 只有你的感觉消散殆尽 <br/>私はまだ上手に片付けられずに 我还是不擅长面对 <br/>I am god's child 我是神的孩子 <br/>この腐败した世界に堕とされた 堕入这已腐败的世界中 <br/>How do I live on such a field? 教我如何在这土地上生存？ <br/>こんなもののために生まれたんじゃない 我并非为此而诞生 <br/>理由をもっと喋り続けて 持续说着更多的理由 <br/>私が眠れるまで 直到我能睡着为止 <br/>効かない薬ばかり転がってるけど 即使只有没有效果的药物在滚动 <br/>ここに声もないのに 这里也没有任何声音 <br/>一体何を信じれば？ 到底还能相信什么？ <br/>I am god's child 我是神的孩子 <br/>哀しい音は背中に爪痕を付けて 悲伤的声音在背脊上留下伤痕 <br/>I can't hang out this world 我无法在这个世界停留 <br/>こんな思いじゃ 这样的思念啊 <br/>どこにも居场所なんてない 没有存在的地方 <br/>不愉快に冷たい壁とか 另人不快的冰冷墙壁 <br/>次はどれに弱さを许す？ 下一个要宽恕谁的软弱？ <br/>最后になど手を伸ばさないで 直到最后也没有伸出手 <br/>贵方なら救い出して 把你救出来 <br/>私を静寂から 我因为那寂静 <br/>时间は痛みを加速させて行く 随着时光流逝，痛苦加重 <br/>I am god's child 我是神的孩子 <br/>この腐败した世界に堕とされた 堕入这已腐败的世界中 <br/>How do I live on such a field? 教我如何在这土地上生存？ <br/>こんなもののために生まれたんじゃない 我并非为了这样的东西而诞生 <br/>I am god's child 我是神的孩子 <br/>哀しい音は背中に爪痕を付けて 悲伤的声音在背脊上留下伤痕 <br/>I can't hang out this world 我无法在这个世界停留 <br/>こんな思いじゃ 这样的思念啊 <br/>どこにも居场所なんてない 没有存在的地方 <br/>How do I live on such a field? 教我如何在这土地上生存？",
                    "作词∶ヒゲドライバー<  作曲∶ヒゲドライバー   编曲∶ヒゲドライバー   歌∶歌组雪月花<br/>夜々(CV.原田ひとみ)、いろり<br/>(CV.茅野爱衣)、小紫(CV.小仓唯)   TVアニメーション「机巧少女は伤つかない」EDテーマ<br/><br/>せ～の いちにっさんはい!<br/>预～备 一、二、三、好～!<br/>ほい! いよーーーーっ ぽん!<br/>哈～!～哟 ーーーー～ 嘣～!<br/>ハッハッハッハッハッハッハイャ★哈～呀<br/>ハッハッハッハッハッハッ う～☆唔～<br/>さぁさぁさぁ ／ 来～来～来～<br/>これよりご覧いただきよすのは<br/>接此下来我们请您来观赏的会是<br/>カブキ者たちの栄枯盛哀<br/>歌舞伎者们的、兴衰成败<br/>时代は常に日进月歩<br/>时代时常是日新月异<br/>闻いてってよ老若男女<br/>男女老少请听我们道来<br/>一见は勧善惩悪<br/>乍一看助善惩恶<br/>悪者どもを一刀両断<br/>坏人们也要一刀两断<br/>?でもホントにそれだけで楽しいの??<br/>?但是真的是只有那样就会开心了吗??<br/>もうなんだって蒟蒻问答<br/>真是的怎么都是答非所问<br/>ハッハッハッハッハッハッハイャ★哈～呀<br/>ハッハッハッハッ<br/>いよーーーーっ ぽん!<br/>～哟ーーーー～ 嘣～!<br/>どこからともなく现れて<br/>不知不觉从何处突然出现<br/>すぐどこか行っちゃって神出鬼没<br/>又突然马上去向何处真是神出鬼没<br/>チャンスを待ったら一日千秋<br/>空等时机的话会感觉一日千秋<br/>追いかければ东奔西走<br/>而去追赶只会东奔西走<br/>时代は常に千変万化<br/>时代时常是千变万化<br/>人の心は复雑怪奇<br/>人心也是千奇百怪<br/>「でも本気でそんなこと言ってんの?」<br/>「但是你说出来的那番话是真心的吗?」<br/>もうどうにも満身创痍<br/>怎么做都是满身创伤阿<br/>呜呼、巡り巡って夜の町<br/>呜呼、巡回于夜晚大街上<br/>キミは合図出し踊りだす<br/>你一发出信号便随之起舞<br/>はぁ～ ★ 哈阿～<br/>回レ回レ回レ回レ回レ回レ回レ回レ回レ!<br/>转啊转啊转啊转啊转啊转啊转啊转啊转啊!<br/>华丽に花弁 散らすように<br/>犹如花瓣华丽的 散落一般<br/>回レ回レ回レ回レ回レ回レ回レ回レ回レ!<br/>转啊转啊转啊转啊转啊转啊转啊转啊转啊!<br/>髪も振り乱して<br/>长发也随风飘散<br/>一昨日、昨日、今日と、明日と、明后日と<br/>无论前天、昨天、还是今天、明天与、后天<br/>この宴は続く ／ 这宴会还会继续<br/>踊レ、歌エ、一心不乱に回レ!<br/>跳吧、唱吧、一心一意的转吧!<br/>今宵は雪月花<br/>因为今宵乃是雪月花<br/>ほい! いよーーーーっ ぽん!<br/>哈～!～哟 ーーーー～ 嘣～!<br/>ハッハッハッハッハッハッハイヤ★哈～呀<br/>ハッハッハッハッハッハッ う～☆呜～<br/>ねぇねぇねぇ ／ 呐～呐～呐～<br/>この世に平安访れるの?<br/>平安已经访问此世了吗?<br/>のべ幕无し丁丁発止<br/>不会闭幕的丁当争斗<br/>兵ども千客万来<br/>官兵们接踵而来<br/>ひしめき合う群雄割拠<br/>相互吵吵嚷嚷群雄割据<br/>伸るか反るか一攫千金<br/>成败在于敢否一举千金<br/>気が付いたら绝体绝命<br/>回过头来却已穷途末路<br/>「でも本音のとこ、どうなってんの?」<br/>「不过真心的所在、到底是什么样呢?」<br/>もうまったく奇想天外<br/>真是的总这么异想天开<br/>鸣呼、辿り辿って夜の町<br/>呜呼、追溯于夜晚的小镇<br/>迷い一つなく踊りだす<br/>心无杂念的就此起舞吧<br/>はぁ～☆哈阿～<br/>回レ回レ回レ回レ回レ回レ回レ回レ回レ!<br/>转啊转啊转啊转啊转啊转啊转啊转啊转啊!<br/>华丽に花弁 散らすように<br/>犹如花瓣华丽的 散落一般<br/>回レ回レ回レ回レ回レ回レ回レ回レ回レ!<br/>转啊转啊转啊转啊转啊转啊转啊转啊转啊!<br/>髪も振り乱して<br/>长发也随风飘散<br/>一昨日、昨日、今日と、明日と、明后日と<br/>无论前天、昨天、还是今天、明天、与后天<br/>この宴は続く ／ 这宴会还会持续<br/>踊レ、歌エ、一心不乱に回レ!<br/>跳吧、唱吧、一心一意的转吧!<br/>今宵は雪月花<br/>因为今宵乃是雪月花<br/>ハッハッハッハッハッハッハイャ☆哈～呀<br/>ハッハッハッハッハッハッ さぁさぁさぁ★来～来～来～<br/>ハッハッハッハッハッハッハイャ☆哈～呀<br/>ハッハッハッハッハッハッ<br/>花で一つ、鸟で二つ<br/>花就是一、鸟就是二<br/>手打ち鸣らす<br/>拍着手轻声唱<br/>风で三つ、呜呼、月出て四つ<br/>风就是三、呜呼、月出就有四<br/>鸣らす鸣らす……<br/>轻声唱轻轻唱……<br/>花で一つ、鸟で二つ<br/>花就是一、鸟就是二<br/>手打ち鸣らす<br/>拍着手轻声唱<br/>风で三つ、呜呼、月出て四つ<br/>风就是三、呜呼、月出就有四<br/>鸣らす鸣らす……<br/>轻轻唱轻声唱……<br/>今は ／现在起<br/>回レ回レ回レ回レ回レ回レ回レ回レ回レ!<br/>转啊转啊转啊转啊转啊转啊转啊转啊转啊!<br/>华丽に花弁 散らすように<br/>犹如花瓣华丽的 散落一般<br/>回レ回レ回レ回レ回レ回レ回レ回レ回レ!<br/>转啊转啊转啊转啊转啊转啊转啊转啊转啊!<br/>髪も振り乱して<br/>长发也随风飘散<br/>一昨日、昨日、今日と、明日と、明后日と<br/>无论前天、昨天、还是今天、明天、与后天<br/>この宴は続く ／这宴会不会结束<br/>踊レ、歌エ、一心不乱に回レ!<br/>跳吧、唱吧、一心一意的转吧!<br/>今宵は何曜日か?<br/>今宵是星期几呢?<br/>水木金?<br/>三四五?<br/>土日月火?<br/>六七一二?<br/>ハッハッハッハッハッハッハイヤ☆～呀<br/>ハッハッハッハッ<br/>いよーーーーっ ぽん!<br/>～哟ーーーー～ 嘣～!"];
    /************************************** 歌词位置初始****************************************/
    function initLrcPos() {
        oLyrics.style.top = 0;
    }
    /************************************** 获取歌词信息(正则表达式)****************************************/
    function getTimeAndLrc(text) {
        var lrc = text;
        var re = /\[[0-9]{2}:[0-9]{2}.[0-9]{2}\]/g;
        var lrcTime = [];
        var nowLrc = lrc.split(re);
        while (re.exec(lrc)) {
            lrcTime.push(re.exec(lrc)[0]);
        }
        for (var i = 0; i < nowLrc.length; i++) {
            if (!nowLrc[i]) {
                nowLrc.splice(i, 1);
            }
        }
        /* console.log(nowLrc);
         console.log(lrcTime);*/
        return {
            lrc: text,
            lrctime: lrcTime
        }
    }
    /************************************** 歌词拖动****************************************/
    oLyrics.onmousedown = function(event) {
        oLyrics.keyup = 0;
        var startY = event.offsetY;
        var beforeTop = getStyle(oLyrics, 'top');
        var change = null;
        oLyrics.onmousemove = function(event) {
            if (!oLyrics.keyup) {
                var beforeTop = getStyle(oLyrics, 'top');
                /* console.log(beforeTop);*/
                var lrcY = event.offsetY;
                change = (lrcY - startY) + beforeTop;
                if (change > 0) {
                    change = 0;
                }
                oLyrics.style.top = change + 'px';

                /*var volumeNum=1-nowTop/max;*/
                /* musicSelf.volume=volumeNum;*/
                /*console.log(volumeNum);*/
            }
            return false;
        }
        document.onmouseup = function() {
            oLyrics.keyup = 1;
            var lrcNum = Math.abs(change / getStyle(oLyrics, 'height'));
            musicSelf.currentTime = lrcNum * musicSelf.duration;
            oLyrics.onmousemove = document.onmouseup = null;

        }
        return false;
    }
    getTimeAndLrc('[00:20.74]Unknown soldier lying on the floor[00:24.61]Explosions forever[00:26.82]Now you take me away from danger[00:30.37]We had always covered up your face[00:34.47]Out there who will watch your back?[00:37.00]Because I don*t know If I can stay here[00:40.49][00:40.91]Game over[00:42.59]Now we hate our brothers[00:45.37]No longer can move my feet[00:49.81][00:50.01]But it*s[00:50.43]Keep on keeping on[00:52.35]And it*s I just wanna know[00:54.58]Inside it*s I don*t want to know[00:57.21]Over head they fly high it*s going[01:00.58]On and on and on[01:02.48]Will we oversee the smile of love and peace for everyone?[01:07.46]You can be sure[01:09.30]I*ll be back again[01:11.74][01:21.27]Broken window glass is everywhere[01:25.04]Explosions forever[01:27.32]Now you save me from oblivion[01:31.28]We had always covered up your face[01:35.15]Out there who will watch your back?[01:37.61]Because I don*t know If I can stay here[01:41.28][01:41.55]Game over[01:42.95]Now we hate our brothers[01:46.50]No longer can move my feet[01:50.32][01:50.51]But it*s[01:50.98]Keep on keeping on[01:52.89]And it*s I just wanna know[01:55.06]Inside it*s I don*t want to know[01:57.71]Over head they fly high it*s going[02:01.09]On and on and on[02:03.07]Will we oversee the smile of love and peace for everyone?[02:08.04]You can be sure[02:09.96]I*ll be back again[02:12.49][02:21.31]And I pxember a long time ago[02:23.73]I will be there for you and please wait for me[02:26.21]Oh you must believe me[02:28.66]Better you believe your mind[02:32.04][02:42.32]But it*s[02:42.85]Keep on keeping on[02:44.67]And it*s I just wanna know[02:46.92]Inside it*s I don*t want to know[02:49.78]Over head they fly high it*s going[02:52.98]On and on and on[02:54.73]Will we oversee the smile of love and peace for everyone?[02:59.88]You can be sure[03:01.76]I*ll be back again[03:04.23][03:13.07]And I pxember a long time ago[03:15.56]I will be there for you and please wait for me[03:18.01]Oh you must believe me[03:20.44]Better you believe your mind[03:22.56][03:23.25]And I pxember a long time ago[03:25.70]I will be there for you and please wait for me[03:28.08]Oh you must believe me[03:30.67]Better you believe your mind[03:34.16][03:40.29]');
    /*oRecord.onmousedown=function(){
        return false;
    }
    oRecordCtrl.onmousedown=function(){
        return false;
    }*/
    //播放列表
    var oMusicList = $('.playListShow');
    var oPlayListWindow = $('.playListWindow');
    console.log(oPlayListWindow);
    var oMusicListLi = $('.playListShow li');
    var ListColorList = ['#fff', '#ececec', '#ddd'];

    var srcList = [];
    var imgList = [];

    var lastBtn = $('.last');
    var nextBtn = $('.next');

    var oHeartLike = $('.heartLike');
    var oHeartLikeImg = $('.heartLikeImg');

    var oLoopBtn = $('.loopIcon');
    var oSendFile = $('.sendFile');
    var oDeleteIcon = $('.deleteIcon');
    var clickedList = null;
    /************************************** 获取播放列表****************************************/
    function getList(obj) {
        srcList = [];
        imgList = [];
        for (var i = 0; i < obj.length; i++) {
            var audio = obj[i].querySelector('audio');
            srcList.push(audio.getAttribute('src'));
            imgList.push(audio.getAttribute('imgSrc'));

        }

    }
    /************************************** 改变播放列表****************************************/
    function changeList() {
        var chooseNum = [];
        while (chooseNum.length < imgList.length) {
            var choose = 1;
            var randomNum = Math.floor(Math.random() * srcList.length);
            for (var j = 0; j < chooseNum.length; j++) {
                if (chooseNum[j] == randomNum) {
                    choose = 0;
                }
            }
            if (choose == 1) {
                chooseNum.push(randomNum);
            }
        }
        var cloneSrcList = [];
        var cloneImgList = [];
        for (var i = 0; i < chooseNum.length; i++) {
            cloneSrcList[i] = srcList[chooseNum[i]];
            cloneImgList[i] = imgList[chooseNum[i]];
        }
        srcList = cloneSrcList;
        imgList = cloneImgList;
        console.log(srcList);
        return chooseNum;
    }
    /************************************** 获取当前音乐索引****************************************/
    function getNowIndex() {
        for (var i = 0; i < srcList.length; i++) {
            /*console.log(srcList[i],musicSelf.getAttribute('src'));*/
            if (srcList[i] == musicSelf.getAttribute('src')) {
                return i;
            }
        }
    }
    lastBtn.onclick = function() {
        turnLastNext(1);
    }
    nextBtn.onclick = function() {
        turnLastNext(0);
    }
    /************************************** 跳转音乐****************************************/
    function turnLastNext(type) {
        var num = type ? getNowIndex() - 1 : getNowIndex() + 1;
        if (num < 0) {
            num = imgList.length - 1;
        }
        if (num == imgList.length) {
            num = 0;
        }
        /*console.log(num);*/
        /*stopSound();
         loadAudioFile(musicSelf.getAttribute('src'));  */
        musicSelf.setAttribute('src', srcList[num]);
        musicSelf.load();
        console.log('按钮切换');
        /* musicSelf.play();*/
        initPlay();
        oMusicListLi[getNowIndex()].style['background-color'] = ListColorList[2];
        oRecordImg.setAttribute('src', imgList[num]);
        oLyricsImg.setAttribute('src', imgList[num]);

    }
    getList(oMusicListLi);
    /*console.log(srcList);*/
    /*var musicPlayList=[];*/
    /*console.log(oMusicListLi);*/
    /*oMusicList.onmousedown=function(){
        oMusicList.keyup=0;
        var startY=event.offsetY;        
        var beforeTop=getStyle(oMusicList,'top');
        var change=null;
        oMusicList.onmousemove=function(event){
            if(!oMusicList.keyup){
                var beforeTop=getStyle(oMusicList,'top');
                var lrcY=event.offsetY;
                change=(lrcY-startY)+beforeTop;
                if(change>0){
                    change=0;
                }
                if(change<(-getStyle(oMusicList,'height')+getStyle(oPlayListWindow,'height'))){
                    change=-getStyle(oMusicList,'height')+getStyle(oPlayListWindow,'height');
                }
                oMusicList.style.top=change+'px';
            }
            return false;
        }
        document.onmouseup=function(){
            oMusicList.keyup=1;
            oMusicList.onmousemove=document.onmouseup=null;

        }
        return false;   
    }*/
    /************************************** 列表滚动****************************************/
    oMusicList.onmousewheel = function(event) {
        var scroll = event.wheelDelta;
        if (scroll > 0) {
            scroll = scroll / 2;
        } else {
            scroll = scroll / 4;
        }
        var nowTop = getStyle(oMusicList, 'top');
        var change = nowTop + scroll;
        if (change > 0) {
            change = 0;
        }
        if (change < (-getStyle(oMusicList, 'height') + getStyle(oPlayListWindow, 'height'))) {
            change = -getStyle(oMusicList, 'height') + getStyle(oPlayListWindow, 'height');
        }
        oMusicList.style.top = change + 'px';
    }
    /************************************** 列表颜色变化****************************************/
    function upDateListColor() {
        for (var i = 0; i < oMusicListLi.length; i++) {
            oMusicListLi[i].style['background-color'] = ListColorList[1 - i % 2];
        }
    }

    upDateListColor();
    oHeartLike.onclick = function() {
        /*oHeartLike.onclick=null;*/
        oHeartLikeImg.className = "heartLikeImg heartLikeImg-active";
        setTimeout(function() {
            oHeartLikeImg.className = "heartLikeImg";
        }, 600);
    }
    oLoopBtn.onclick = function() {
        oLoopBtn.onoff = oLoopBtn.onoff ? 0 : 1;
        var use = oLoopBtn.querySelector('use');

        if (oLoopBtn.onoff) {
            use.setAttribute('xlink:href', '#icon-suiji2');
            changeList();
        } else {
            use.setAttribute('xlink:href', '#icon-duihuan');
            getList(oMusicListLi);
        }

    }
    for (var i = 0; i < oMusicListLi.length; i++) {
        (function(i) {
            oMusicListLi[i].onclick = function() {
                upDateListColor();
                var _this = this;
                var _thisAudio = _this.querySelector('audio')
                var _thisSrc = _thisAudio.getAttribute('src');
                var imgSrc = _thisAudio.getAttribute('imgSrc');
                /*musicSelf.pause();   */
                /*stopSound();
                loadAudioFile(_thisSrc); */
                console.log('list切换');
                musicSelf.src = _thisSrc;
                musicSelf.load();
                initPlay();
                oRecordImg.src = imgSrc;
                oLyricsImg.src = imgSrc;
                _this.style['background-color'] = ListColorList[2];
            }
        }(i));

    }
    /************************************** 初始化播放****************************************/
    function initPlay() {
        oRecordMove();
        upDateListColor();
        initLrcPos();
    }
    //用户界面
    var user = $('.user');
    var AllImg = $('img');
    var userShow = $('.userShow');
    var oSearchInput = $('.searchInput');
    var oSearchBtn = $('.searchBtn');
    var oSendFileBtn = $('.sendFileUp');
    var oSendFileForm = $('.sendFileForm');
    var oChangeStyleColorBtn = $('.changeStyleColor');
    var StyleColorUl = $('.styleColor');

    userShow.click = 0;

    for (var i = 0; i < AllImg.length; i++) {
        AllImg[i].onmousedown = function() {
            return false;
        }
    }
    userShow.onclick = function() {
            var Width = getStyle(user, 'width');

            if (user.className == 'user') {
                user.className = 'user user-active';
                userShow.style.transform = 'rotate(180deg)';
            } else {
                user.className = 'user';
                userShow.style.transform = 'rotate(0deg)';
            }
            //user.style.right=userShow.click?'0':-Width+40+'px';
        }
        /* user.onmousedown=function(event){

             var dragOn=0;
             if(event.offsetX<30){
                 console.log(event.offsetX);
                 dragOn=1;
             }
             var beforeX=event.offsetX;
             var beforeRight=getStyle(user,'right');
             document.onmousemove=function(event){
                 if(dragOn){
                     var dragX=event.offsetX;
                     beforeRight=getStyle(user,'right');
                     var change=beforeRight-(dragX-beforeX);
                     if(change>-10){
                         change=0;
                     }
                     if(change<-getStyle(user,'width')+30){
                         change=-getStyle(user,'width')+30;
                     }
                     user.style.right=change+'px';

                 }
                 return false;
             }
             document.onmouseup=function(){
                 dragOn=0;
                 user.onmousemove=document.onmouseup=null;
             }
             return dragOn?false:true;
         }*/
    oSearchBtn.onclick = function() {
        userOtherClose();
        oSearchBtn.onoff = oSearchBtn.onoff ? 0 : 1;
        if (oSearchBtn.onoff) {
            oSearchInput.className = 'searchInput searchInput-active';

        } else {
            oSearchInput.className = 'searchInput';
        }
    }
    oSearchInput.onkeyup = function(event) {
            if (event.keyCode == '13') {
                this.value = "";
            }
        }
        //上传文件
    oSendFileBtn.onclick = function() {
        userOtherClose();
        oSendFileBtn.onoff = oSendFileBtn.onoff ? 0 : 1;
        if (oSendFileBtn.onoff) {
            oSendFileForm.className = 'sendFileForm sendFileForm-active';

        } else {
            oSendFileForm.className = 'sendFileForm';
        }

    };

    function userOtherClose() {
        oSearchInput.className = 'searchInput';
        oSendFileForm.className = 'sendFileForm';
        StyleColorUl.className = 'styleColor';
    }

    function getFileName() {

    }
    /**************************************改变主题色 ****************************************/
    oChangeStyleColorBtn.onclick = function() {

        userOtherClose();
        oChangeStyleColorBtn.onoff = oChangeStyleColorBtn.onoff ? 0 : 1;
        if (oChangeStyleColorBtn.onoff) {
            StyleColorUl.className = 'styleColor styleColor-active';

        } else {
            StyleColorUl.className = 'styleColor';
        }

    }
    var StyleColorLi = $('.styleColor li');
    //需要改变颜色的元素
    //border
    var backBorder = $('.backBorder');
    var recordBack = $('.recordBack');
    var musicShow = $('.musicShow');
    //bgc

    //user
    //oVolumeLine
    //oRecordCtrl
    var ctrlBall = $('.ctrlBall');
    //color
    var fontChoose = $('.font-choose');
    var musicListPic = $('.musicListPic');



    var NowStyleColor = '';
    for (var i = 0; i < StyleColorLi.length; i++) {
        StyleColorLi[i].onclick = function() {
            var _this = this;
            NowStyleColor = _this.style['background-color'];
            backBorder.style['border-color'] = NowStyleColor;
            recordBack.style['border-color'] = NowStyleColor;
            musicShow.style['border-color'] = NowStyleColor;

            user.style['background-color'] = NowStyleColor;
            oVolumeLine.style['background-color'] = NowStyleColor;
            oRecordCtrl.style['background-color'] = NowStyleColor;
            ctrlBall.style['background-color'] = NowStyleColor;

            for (var j = 0; j < fontChoose.length; j++) {
                fontChoose[j].style['color'] = NowStyleColor;
            }
            canvasLineColor = NowStyleColor;
            musicListPic.style['color'] = NowStyleColor;

        }
    }
    /*document.onmousedown=function(){
        return false;
    }*/


}
