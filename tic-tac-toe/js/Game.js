   const EMPTY = '';

   const PLAYERONE = 'X';
   const PLAYERTWO = 'O';

   const result ={
        NONE: 0,
        PLAYERONEWIN: 1,
        PLAYERTWOWIN: 2,
        DRAW: 3
   }

   const ROWS = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
   ]

   const COLS = [
        [0,3,6],
        [1,4,7],
        [2,5,8]
   ]

   const DIAS = [
        [0,4,8],
        [2,4,6]
   ]


  const UNITS = ROWS.concat(COLS).concat(DIAS)

  var player;

  class Game{
    constructor(game){
        if(game){
          this.board = game.board.slice(0);
          this.playerOneTurn = game.playerOneTurn;
          this.result = game.result;
          this.hitUnit = game.hitUnit;
        }else{
          this.board = ['','','',
                        '','','',
                        '','',''];
          this.playerOneTurn = true;    //true:player1, false:player2
          this.result = result.NONE;
          this.hitUnit = '';
        }

    }

   move(pos){
       if(this.result !==result.NONE){
           return;
       }
      if(this.board[pos] === EMPTY){
        if (this.playerOneTurn){
          this.board[pos] = PLAYERONE;
        }
        else
        {
          this.board[pos] = PLAYERTWO;
        }

        this.playerOneTurn = !this.playerOneTurn;
        this._checkGame();
        return this;
      }


    }
    botMove(){
      var moveList,
          random;

      moveList= this._minimax(this);


      function randomInt(min, max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      random = randomInt(0, moveList.length-1)
      this.move(moveList[random])
      return this;

    }

    _checkGame(){

     for(var unit in UNITS){
      var pos0 = UNITS[unit][0],
          pos1 = UNITS[unit][1],
          pos2 = UNITS[unit][2];

      var set = [this.board[pos0], this.board[pos1], this.board[pos2] ];

      if ( set.indexOf(EMPTY) !== -1){
          continue;
      }

      if (set[0] === set[1] && set[1]=== set[2]){
          this.hitUnit = unit;
          if (set[0] === PLAYERONE){
              this.result = result.PLAYERONEWIN;
              return this;
          }
          else{
              this.result = result.PLAYERTWOWIN;
              return this;
          }
      }

      }
      ///
      if (this.board.indexOf(EMPTY) === -1){
          this.result = result.DRAW;
          return this;
      }

       return this;
    }

     _minimax(){
    // minmax game
    //http://neverstopbuilding.com/minimax
        var resultMove=[],
            isPlayerOne;

        isPlayerOne = this.playerOneTurn;


        function calcGame(game, depth){
          if(game.result != result.NONE){
            var score;

            switch(game.result){
              case result.PLAYERONEWIN: return  (isPlayerOne)? 10 - depth : depth -10  ;
              case result.PLAYERTWOWIN: return  (isPlayerOne)? depth -10: 10 - depth  ;
              case result.DRAW: return 0;
            }

          }
          else
          {
               return calcGames(game, depth)
          }
        }

        function calcGames(game, depth){
            var pos,
                games=[],
                scores= [],
                moves =[],
                newGame,
                indexList;
            depth++;
            for( pos=0 ; pos < 9; pos++){
              if(game.board[pos] === EMPTY){
                 newGame = new Game(game)
                 newGame.move(pos);
               //  console.log(newGame.board)
                 scores.push(calcGame(newGame, depth))
                 moves.push(pos);
              }
            }

            if(!(game.playerOneTurn ^ isPlayerOne)){
                indexList = maxIndex(scores)
            }
            else
            {
                indexList = minIndex(scores)
            }
            if (depth ===1){
                resultMove=[];
                indexList.forEach(function(index){
                   resultMove.push(moves[index])
                })

            }

            return scores[indexList[0]];

        }

        function maxIndex(arr){
          if (arr.length === 0) {
            return -1;
          }
          var maxScore,
              maxIndex=[],
              index,
              length = arr.length,
              result=[];

          maxScore = arr[0];
          maxIndex.push(0);

          for(index=1; index<length; index++){
              if(arr[index] === maxScore){
                maxIndex.push(index)
              }
              else if(arr[index] > maxScore){
                maxIndex = []
                maxIndex.push(index);
                maxScore = arr[index]
              }
          }

          return maxIndex;

        }

        function minIndex(arr){
          if (arr.length === 0) {
            return -1;
          }
          var minScore,
              minIndex=[],
              index,
              length = arr.length;

          minScore = arr[0];
          minIndex.push(0);

          for(index=1; index<length; index++){
              if(arr[index] === minScore){
                minIndex.push(index)
              }
              else if(arr[index] < minScore){
                minIndex=[];
                minIndex.push(index)
                minScore = arr[index]
              }
          }

          return minIndex;

        }

       calcGame(this, 0)
       return resultMove;

  }

}
