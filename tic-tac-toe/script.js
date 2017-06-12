$(function(){
    console.log('start')
    function delay(ms){
        return new Promise(function(resolve, reject){
            setTimeout(resolve, ms)
        })
    }

  // You can play the game !!!!
    var audioCtx = new AudioContext();

    var frequencies = [195.998,329.628];

    var ramp = 0.05;
    var vol = 0.5;


    // create Oscillators
    var oscillators = frequencies.map(function(frq){
      var osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = frq;
      osc.start(0.0); //delay optional parameter is mandatory on Safari
      return osc;
    });

    var gainNodes = oscillators.map(function(osc){
      var g = audioCtx.createGain();
      osc.connect(g);
      g.connect(audioCtx.destination);
      g.gain.value = 0;
      return g;
    });


    function playGoodTone(num){
      gainNodes[num].gain
        .linearRampToValueAtTime(vol, audioCtx.currentTime + ramp);
    };

    function stopGoodTones(){
      gainNodes.forEach(function(g){
        g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ramp);
      });
    };





    var App = {
        //init
        init:function(){
            this.gridBoard = $('#grid-board');
            this.gridBoard.removeClass('start')
            this.game = new Game();
            this.bindEvent();
            this.render();

        },
        bindEvent(){
            $('#grid-board').on('click','.cell',this.clickCell.bind(this));
            $('#start').on('click',this.start.bind(this));
            $('#again').on('click',this.again.bind(this));
        },
        clickCell(e){


            if (this.gridBoard.hasClass('unclickable') || !this.game.result === result.NONE ||
                 this.game.board[$('.cell').index(e.target)] !== EMPTY ){
                return;
            }

            playGoodTone(1)

            this.gridBoard.addClass('unclickable')

            this.game.move( $('.cell').index(e.target))

            this.render();

            delay(0).then(function(){

                this.game.botMove();
                return delay(700)
            }.bind(this))
            .then(function(){
                stopGoodTones()
                this.render();
                this.gridBoard.removeClass('unclickable')
            }.bind(this))

        },
        start(e){

            $('#grid-board').addClass('start')
        },
        again(){
            $('.result').text('');
            $('#hit-line').attr('class','');
            $('#hit-line').addClass('check-bar');
            this.game = new Game();
            this.render();
        },
        render(){
            var resultInfo = {
                0: '',
                1: 'X Win',
                2: 'O Win',
                3: 'Draw'
            }

            var hitline = [
                'hor-0',
                'hor-1',
                'hor-2',
                'ver-0',
                'ver-1',
                'ver-2',
                'dia-0',
                'dia-1'
            ]

            $('#grid-board').html('');

            if (this.game.result !== result.NONE){

                $('.result').text(resultInfo[this.game.result]);
                $('#hit-line').attr('class','');
                $('#hit-line').addClass('check-bar');
                $('#hit-line').addClass(hitline[this.game.hitUnit])
            }else{

            }

            this.game.board.forEach(function(cell){
                $('#grid-board').append(`<span class="cell">${cell}</span>`)
            })

        }
        //input board, position

    }


    App.init();


})