$(function(){

    function regionPress(pos){
        $(`.region:nth-child(${pos})`).addClass('light')
                                      .children('audio')[0].play();
    }
    function regionRelease(pos){
        $(`.region:nth-child(${pos})`).removeClass('light');
    }

    function delay(ms){
        return new Promise(function(resolve, reject){
            setTimeout(resolve, ms)
        })
    }

    function regionActive(pos , ms){
        regionPress(pos);

        return delay(ms).then(function(){
             regionRelease(pos)
             return delay(0)
        })

    }
    function getRandom(){
        return (Math.floor(Math.random()*10) % 4)+1;
    }
//web audio api

    var audioCtx = new AudioContext();
    var errOsc = audioCtx.createOscillator();
    errOsc.type = 'triangle';
    errOsc.frequency.value = 110;
    errOsc.start(0.0); //delay optional parameter is mandatory on Safari

    var errNode = audioCtx.createGain();
    errOsc.connect(errNode);
    errNode.gain.value = 0;
    errNode.connect(audioCtx.destination);

    var ramp = 0.05;
    var vol = 0.5;

    var gameStatus = {};

    function playErrTone(){
      errNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + ramp);
    };

    function stopErrTone(){
      errNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ramp);
    };


    var data ={
        list: [],
        isStrictMode: false,
        level:1
    };


   var simon = {
    state: undefined,
    states: {
        off:{
            initialize(target){
                this.target = target;

            },
            execute(){
                $('.counter').text('')
                console.log('simon has been off')
            },
            on(){
                 console.log('simon has turn on')
                 // init
                 $('.counter').text('--');
                 $('.strict-led').removeClass('on');
                 $('.counter').removeClass('blink');
                 $('.region').addClass('unclickable')
                 data.list=[];
                 data.isStrictMode = false;
                 data.level = 1;
                 this.target.changeState(this.target.states.ready)
            },
            off(){
                console.log('simon has turn off')
                this.target.changeState(this.target.states.off)
            },
            start(){
                console.log('simon has been off')
            },
            strict(){
                console.log('simon has been off')
            }
            ,
            play(){
                console.log('simon has been off')
            },
            receive(){
                console.log('simon has been off')
            },
            exit(){
                console.log('simon has been off')
            }
        },
        ready:{
            initialize(target){
                this.target = target;
            },
            execute(){
                console.log('execute ready state')
                data.level = 1;
                data.isStrictMode = false;
            },
            on(){
                console.log('simon has been already power-on')
            },
            off(){
                 console.log('simon has turn off')
                this.target.changeState(this.target.states.off)
            },
            start(){
                $('.counter').text('--').addClass('blink');
                this.target.changeState(this.target.states.playing)
            },
            strict(){
                data.isStrictMode = !data.isStrictMode;
                $('.strict-led').toggleClass('on', data.isStrictMode);
            },
            play(){
                console.log('you need to click the start button')
            },
            receive(){
                console.log('invalid operation')
            },
            exit(){

            }
        },
        playing:{
            initialize(target){
                this.target = target;
            },
            execute(){
                console.log('execute playing state')
                this.round = 0;
                this.list = data.list;

                delay(2000).then(function(){
                    $('.counter').text(data.level).removeClass('blink');
                    stopErrTone();
                    this.target.play();
                }.bind(this))

            },
            on(){
                console.log('simon has been already power-on')
            },
            off(){
                console.log('simon has turn off')
                this.target.changeState(this.target.states.off)
            },
            start(){
                console.log('simon game already start')
            },
            strict(){
                data.isStrictMode = !data.isStrictMode;
                $('.strict-led').toggleClass('on', data.isStrictMode);
            },
            play(){
                if(this.round < data.level){
                    //light(300ms)-->delsy(800ms)-->next light/ receving state
                    if (data.list[this.round] === undefined){
                        data.list[this.round] = getRandom();
                    }

                    regionActive(data.list[this.round],300)
                    .then(function(){
                        return delay(600);
                    })
                    .then(function(){
                        this.round++;
                        this.target.play();
                    }.bind(this))

                }else{
                    this.target.changeState(this.target.states.receiving)
                }
            },
            receive(){
                console.log('invalid operation')
            },
            exit(){
                clearTimeout(this.timer);
            }

        },
        receiving:{
            initialize(target){
                this.target = target;
                this.list = data.list;
                this.timeout;
                this.round;
                this.fail = function(){
                        if (data.isStrictMode){
                            data.level = 1;
                        }
                        $('.counter').text('!!').addClass('blink');
                        playErrTone();
                        this.target.changeState(this.target.states.playing)
                },

                this.levelup = function(){
                    data.level++;
                    this.target.changeState(this.target.states.playing)
                },


                this.$region = $('.region');
            },
            execute(){
                console.log('execute receiving state')
                this.round = 0;
                this.$region.removeClass('unclickable')
                this.timeout = setTimeout(this.fail.bind(this),3000)
            },

            on(){
                console.log('simon has been already power-on')
            },
            off(){
                console.log('simon has turn off')
                clearTimeout(this.timeout);

                this.target.changeState(this.target.states.off)
            },
            start(){
                console.log('simon game already start')
            },
            strict(){
                data.isStrictMode = !data.isStrictMode;
                $('.strict-led').toggleClass('on', data.isStrictMode);
            },
            play(){
                console.log('invalid operation')
                //counter++
            },
            receive(pos){
                 clearTimeout(this.timeout);
                 //right order
                if(pos === data.list[this.round]){
                    $(`.region:nth-child(${pos})`).children('audio')[0].play();
                    $(`.region:nth-child(${pos})`).addClass('light');

                    this.round++;
                    if (this.round < data.level){
                        //response answer in 3 second
                        this.timeout = setTimeout(this.fail.bind(this),3000)
                    }
                    //level up
                    else{
                        this.levelup();
                    }
                }
                //wrong order
                else{

                    this.fail()
                }

            },
            exit(){
                clearTimeout(this.timeout);

            }
        }
    },//states
    initialize(){
        //this = player object
        this.states.off.initialize(this);
        this.states.ready.initialize(this);
        this.states.playing.initialize(this);
        this.states.receiving.initialize(this);
        this.state = this.states.off;
    },
    off(){
        this.state.off();
    },
    on(){
        this.state.on();
    },
    start(){
        this.state.start();
    },
    strict(){
        this.state.strict();
    },
    play(){
        this.state.play();
    },
    receive(pos) {
        this.state.receive(pos);
    },
    changeState: function(state) {
        if (this.state !== state) {
            this.state.exit();
            this.state = state;
       //     this.state.enter();
            this.state.execute();
        }
    }

   }

    var app ={
     init(){
        this.isSwitchOn = false;
        simon.initialize();
        this.bindEvent();
     },
     bindEvent(){
        $('.slide-switch').on('click',this.toggleswitch).bind(this);
        $('.start-btn').on('click',this.start).bind(this)
        $('.region').on('mousedown', this.regionMousedown)
                    .on('mouseup', this.regionMouseup)
        $('.strict-btn').on('click', this.strict)

     },
     toggleswitch(e){
        this.isSwitchOn = !this.isSwitchOn;
        $('.slide-switch').toggleClass('on',this.isSwitchOn);
        if(this.isSwitchOn){
            simon.on();
        }else{
            simon.off();
        }
     },
     start(){
        simon.start();
     },
     strict(){
        simon.strict();
     },

     regionMousedown(e){
        //get position of region and shift 1
        if ($(e.target).hasClass('unclickable')){
            return
        }
        simon.receive($('.region').index(e.target)+1);
     },
     regionMouseup(e){
        if ($(e.target).hasClass('unclickable')){
            return
        }
        $(e.target).removeClass('light');
     }

   }

   app.init();


})