suite('test Game class', function(){

    var game = new Game();

    test('constructor init', function(){

        assert.deepEqual(game.board,['','','',
                                      '','','',
                                      '','',''], 'same ordered members');
        assert.equal(game.playerOneTurn, true);
        assert.equal(game.result, result.NONE);
        assert.equal(game.hitUnit, '');


    });


})


suite('test move', function(){


    test('test move full', function(){
        var i,
            game = new Game();

        for(i=0 ; i<9 ; i++){
            game.move(i)
        }
        console.log(game.board)
        assert.deepEqual(game.board, ['X','O','X',
                                      'O','X','O',
                                      'X','','']);

    });

    suite('test move detail', function(){
        var game;
        setup(function() {
              game = new Game({
                board:[ 'O','' ,'X',
                        'X','' ,'',
                        'X','O','O'],
                playerOneTurn:true,
                result:result.NONE,
                hitUnit:''
             })
    // ...
        });



        test('test move case1', function(){
            game.move(1)
            assert.deepEqual(game, new Game({
                                    board:[ 'O','X' ,'X',
                                            'X','' ,'',
                                            'X','O','O'],
                                    playerOneTurn:false,
                                    result:result.NONE,
                                    hitUnit:''
                                 })
                              );
        })

        test('test move case2', function(){
            game.move(4)
            assert.deepEqual(game, new Game({
                                    board:[ 'O','' ,'X',
                                            'X','X' ,'',
                                            'X','O','O'],
                                    playerOneTurn:false,
                                    result:result.PLAYERONEWIN,
                                    hitUnit:'7'
                                 })
                              );
        })

        test('test move case3', function(){
            game.move(5)
            assert.deepEqual(game, new Game({
                                    board:[ 'O','' ,'X',
                                            'X','' ,'X',
                                            'X','O','O'],
                                    playerOneTurn:false,
                                    result:result.NONE,
                                    hitUnit:''
                                 })
                              );
        })
    })
})


suite('test check game', function(){


     var game1 = new Game({
            board:[ 'X','X','X',
                    'O','X','O',
                    'X','O','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game2 = new Game({
            board:[ 'O','X','O',
                    'X','X','X',
                    'X','O','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game3 = new Game({
            board:[ 'O','X','O',
                    'X','O','O',
                    'X','X','X'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game4 = new Game({
            board:[ 'X','O','X',
                    'X','X','O',
                    'X','O','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game5 = new Game({
            board:[ 'O','X','X',
                    'O','X','O',
                    'X','X','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game6 = new Game({
            board:[ 'X','O','X',
                    'O','X','X',
                    'O','O','X'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game7 = new Game({
            board:[ 'X','O','X',
                    'O','X','O',
                    'O','O','X'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game8 = new Game({
            board:[ 'X','O','X',
                    'O','X','O',
                    'X','X','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game9 = new Game({
            board:[ 'X','O','X',
                    'O','X','X',
                    'O','X','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })
        var game10 = new Game({
            board:[ 'X','','X',
                    'O','','O',
                    'X','','O'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })


    test('test check row0', function(){
        game1._checkGame();
        assert.equal(game1.result, result.PLAYERONEWIN)
        assert.equal(game1.hitUnit, '0')

    })
    test('test check row1', function(){
        game2._checkGame();
        assert.equal(game2.result, result.PLAYERONEWIN)
        assert.equal(game2.hitUnit, '1')

    })
    test('test check row2', function(){
        game3._checkGame();
        assert.equal(game3.result, result.PLAYERONEWIN)
        assert.equal(game3.hitUnit, '2')

    })

    test('test check col0', function(){
        game4._checkGame();
        assert.equal(game4.result, result.PLAYERONEWIN)
        assert.equal(game4.hitUnit, '3')

    })
    test('test check col1', function(){
        game5._checkGame();
        assert.equal(game5.result, result.PLAYERONEWIN)
        assert.equal(game5.hitUnit, '4')

    })
    test('test check col2', function(){
        game6._checkGame();
        assert.equal(game6.result, result.PLAYERONEWIN)
        assert.equal(game6.hitUnit, '5')

    })
    test('test check dia1', function(){
        game7._checkGame();
        assert.equal(game7.result, result.PLAYERONEWIN)
        assert.equal(game7.hitUnit, '6')

    })
    test('test check dia2', function(){
        game8._checkGame();
        assert.equal(game8.result, result.PLAYERONEWIN)
        assert.equal(game8.hitUnit, '7')

    })
    test('test check draw', function(){
        game9._checkGame();
        assert.equal(game9.result, result.DRAW)
        assert.equal(game9.hitUnit, '')

    })
    test('test check none', function(){
        game10._checkGame();
        assert.equal(game10.result, result.NONE)
        assert.equal(game10.hitUnit, '')

    })

})



suite('test  AI', function(){
        var game,games,ans;


        game1 = new Game({
            board:[ 'O','' ,'X',
                    'X','' ,'',
                    'X','O','O'],
            playerOneTurn:true,
            result:result.NONE,
            hitUnit:''
        })


        game2 = new Game({
            board:[ '' ,'X','',
                    '' ,'' ,'X',
                    'O','O','X'],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })

        game3 = new Game({
            board:[ 'X' ,''  ,'',
                    '' ,'X' ,'',
                    '' ,'O' ,''],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })

        game4 = new Game({
            board:[ 'X' ,''  ,'',
                    '' ,'X' ,'',
                    '' ,'O' ,'O'],
            playerOneTurn:true,
            result:result.NONE,
            hitUnit:''
        })

        game5 = new Game({
            board:[ '' ,''  ,'',
                    '' ,'X' ,'',
                    '' ,'' ,''],
            playerOneTurn:false,
            result:result.NONE,
            hitUnit:''
        })





        test('test minimax case1', function(){

            assert.deepEqual(game1._minimax(game1), [4])
        })


        test('test minimax case2', function(){

            assert.deepEqual(game2._minimax(game2), [2])
        })

        test('test minimax case3', function(){

            assert.deepEqual(game3._minimax(game3), [8])
        })

        test('test minimax case4', function(){

            assert.deepEqual(game4._minimax(game4), [6])
        })

        test('test minimax case5', function(){

            assert.deepEqual(game5._minimax(game5), [0,2,6,8])
        })


})


suite('test botmove', function(){


    var game;

    setup(function(){
        var i;

        game = new Game();
        for(i=0; i<9; i++){
           // console.log(game.board)
           game.botMove();
         //   console.log(game.board);
        }

    })


     test('test minimax case1', function(){

            assert.equal(game.result, result.DRAW)
     })

     test('test minimax case2', function(){

            assert.equal(game.result, result.DRAW)
     })
     test('test minimax case3', function(){

            assert.equal(game.result, result.DRAW)
     })


})