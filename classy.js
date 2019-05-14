pieceClicked = false;
firstPos = null;

b_pawn = "&#9823";
b_knight = "&#9822";
b_bishop = "&#9821";
b_rook = "&#9820";
b_queen = "&#9819";
b_king = "&#9818";

w_pawn = "&#9817";
w_knight = "&#9816";
w_bishop = "&#9815";
w_rook = "&#9814";
w_queen = "&#9813";
w_king = "&#9812";

check = true;

text = document.getElementById("text");
upgradeBox = document.getElementById("upgrades");
turnLabel = document.getElementById("turn");
checkLabel = document.getElementById("check");
restart = document.getElementById("restart");
checkLabel.style.display = "none";
text.style.display = "none";
upgradeBox.style.display = "none";
restart.style.display = "none";

baseHeight = ($("#body").height() - 640)/2;
hFont = $("#header").css("font-size");
upgradesHeight = 50;
uFont = 14;
hFont = hFont.slice(0,hFont.length-2);

halfPad = ((baseHeight-hFont)/2).toString();
thirdPad = ((baseHeight-(2*hFont))/3).toString();
sixthPad = ((baseHeight-(2*hFont))/6).toString();
upgradePadThird = (((baseHeight)-uFont-upgradesHeight)/3).toString();
upgradePadSixth = (((baseHeight)-uFont-upgradesHeight)/6).toString();

document.getElementById("header").style.padding = halfPad + " 0px " + halfPad + " 0px";
upgradeBox.style.padding = upgradePadThird + " 0px " + upgradePadSixth + " 0px";
text.style.padding = upgradePadSixth + " 0px " + upgradePadThird + " 0px";

$(document).ready(function(){
  resetGame()
});

class Graph {
    constructor(){
      this.AdjList = new Map();
	    this.WeightList = new Map();
    }

    addVertex(v,w){
	    this.AdjList.set(v, []);
	    this.WeightList.set(v,w);
	  }

	  addEdge(v, w){
	    this.AdjList.get(v).push(w);

	    this.AdjList.get(w).push(v);
	  }

	  printGraph(){
	    var get_keys = this.AdjList.keys();

	    for (var i of get_keys){
	        var get_values = this.AdjList.get(i);
	        var conc = "";

	        for (var j of get_values)
	            conc += j + " ";

	        console.log(i + " -> " + conc + " weight " + this.WeightList.get(i));
	    }
    }
}

class Board{
     constructor(playerTurn,squares){
          this.playerTurn = playerTurn;
          if(squares==null){
            this.squares = new Map();
          }
          else{
            this.squares = squares;
          }
          this.uX = null;
          this.uY = null;
          this.children = [];
          this.value = 0
     }

     getValue(){
       return this.value;
     }

     setValue(val){
       this.value = val;
     }

     getSquares(){
       return this.squares;
     }

     getTurn(){
       return this.playerTurn;
     }

     setTurn(turn){
       this.playerTurn = turn;
     }

     setSquare(pos,piece){
       var key = pos[0].toString() + ',' + pos[1].toString()
       this.squares.set(key,piece);
     }

     getSquare(pos){
       return this.squares.get(pos[0].toString() + ',' + pos[1].toString());
     }

     initialize(){
        for(var x=1;x<9;x++){
      		for (var y=1;y<9;y++){
      			if(y<3 || y>6){
      				var piece = new Object();
      				if(y<3)
      					piece.color = "b";
      				else
      					piece.color = "w";
      				piece.moves = []
      				if(y==2 || y==7){
      					piece.type="pawn";
      					piece.started=false;
      				}
      				else{
      					if(x==1 || x==8){
      						piece.type = "rook";
      					}
      					if(x==2 || x==7){
      						piece.type = "knight";
      					}
      					if(x==3 || x==6){
      						piece.type = "bishop";
      					}
      					if(x==4){
      						piece.type = "queen";
      					}
      					if(x==5){
      						piece.type = "king";
      					}
      				}
      				this.setSquare([x,y],piece);
      			}
      			else
      				this.setSquare([x,y],null);
      		}
      	}
      }

     computeMoves(){
       for(var x=1;x<9;x++){
     		for (var y=1;y<9;y++){
     			if(this.getSquare([x,y]) != null){
     				var m = [];
     				var piece = this.getSquare([x,y]);
     				if(piece.type == "pawn"){
     					if(piece.color == "w"){
     						if(piece.started == false && this.getSquare([x,y-2])==null){
     							m.push([x,y-2]);
     						}
     						if(y-1>0 && this.getSquare([x,y-1])==null)
     							m.push([x,y-1]);
     						if(x-1>0 && y-1>0 && squareOpp(x-1,y-1,piece.color))
     							m.push([x-1,y-1]);
     						if(x+1<9 && y-1>0 && squareOpp(x+1,y-1,piece.color))
     							m.push([x+1,y-1]);
     					}
     					if(piece.color == "b"){
     						if(piece.started == false && this.getSquare([x,y+2])==null){
     							m.push([x,y+2]);
     						}
     						if(y+1<9 && this.getSquare([x,y+1])==null)
     							m.push([x,y+1]);
     						if(x-1>0 && y+1<9 && squareOpp(x-1,y+1,piece.color))
     							m.push([x-1,y+1]);
     						if(x+1<9 && y+1<9 && squareOpp(x+1,y+1,piece.color))
     							m.push([x+1,y+1]);
     					}
     				}
     				if(piece.type == "knight"){
     					for(var mX=1;mX<3;mX++){
     						for(var mY=1;mY<3;mY++){
     							if(mX!=mY){
     								if(x-mX>0 && y-mY>0 && squareClear(x-mX,y-mY,piece.color))
     									m.push([x-mX,y-mY]);
     								if(x-mX>0 && y+mY<9 && squareClear(x-mX,y+mY,piece.color))
     									m.push([x-mX,y+mY]);
     								if(x+mX<9 && y-mY>0 && squareClear(x+mX,y-mY,piece.color))
     									m.push([x+mX,y-mY]);
     								if(x+mX<9 && y+mY<9 && squareClear(x+mX,y+mY,piece.color))
     									m.push([x+mX,y+mY]);
     							}
     						}
     					}

     				}
     				if(piece.type == "bishop" || piece.type == "queen"){
     					var mX = 1;
     					var mY = 1;
     					while(x+mX <9 && y+mY < 9){
     						if(squareClear(x+mX,y+mY,piece.color))
     							m.push([x+mX,y+mY]);
     						else{
     							mX = 9-x;
     						}
     						if(squareOpp(x+mX,y+mY,piece.color)){
     							mX = 9-x;
     						}
     						mX++;
     						mY++;
     					}
     					mX = 1;
     					mY = 1;
     					while(x+mX <9 && y-mY > 0){
     						if(squareClear(x+mX,y-mY,piece.color))
     							m.push([x+mX,y-mY]);
     						else{
     							mX = 9-x;
     						}
     						if(squareOpp(x+mX,y-mY,piece.color)){
     							mX = 9-x;
     						}
     						mX++;
     						mY++;
     					}
     					mX = 1;
     					mY = 1;
     					while(x-mX>0 && y+mY<9){
     						if(squareClear(x-mX,y+mY,piece.color))
     							m.push([x-mX,y+mY]);
     						else{
     							mX = x;
     						}
     						if(squareOpp(x-mX,y+mY,piece.color)){
     							mX = x;
     						}
     						mX++;
     						mY++;
     					}
     					mX = 1;
     					mY = 1;
     					while(x-mX>0 && y-mY>0){
     						if(squareClear(x-mX,y-mY,piece.color))
     							m.push([x-mX,y-mY]);
     						else{
     							mX = x;
     						}
     						if(squareOpp(x-mX,y-mY,piece.color)){
     							mX = x;
     						}
     						mX++;
     						mY++;
     					}
     				}
     				if(piece.type == "rook" || piece.type == "queen"){
     					for(mX=x+1;mX<9;mX++){
     						if(squareClear(mX,y,piece.color))
     							m.push([mX,y]);
     						else
     							mX = 9;
     						if(squareOpp(mX,y,piece.color)){
     							mX = 9;
     						}
     					}
     					for(mX=x-1;mX>0;mX--){
     						if(squareClear(mX,y,piece.color))
     							m.push([mX,y]);
     						else
     							mX = 0;
     						if(squareOpp(mX,y,piece.color)){
     							mX = 0;
     						}
     					}
     					for(mY=y+1;mY<9;mY++){
     						if(squareClear(x,mY,piece.color))
     							m.push([x,mY]);
     						else
     							mY = 9;
     						if(squareOpp(x,mY,piece.color)){
     							mY = 9;
     						}
     					}
     					for(mY=y-1;mY>0;mY--){
     						if(squareClear(x,mY,piece.color))
     							m.push([x,mY]);
     						else
     							mY = 0;
     						if(squareOpp(x,mY,piece.color)){
     							mY = 0;
     						}
     					}
     				}
     				if(piece.type == "king"){
   						if(x-1>0 && squareClear(x-1,y,piece.color))
   							m.push([x-1,y]);
   						if(x-1>0 && y+1<9 && squareClear(x-1,y+1,piece.color))
   							m.push([x-1,y+1]);
   						if(x-1>0 && y-1>0 && squareClear(x-1,y-1,piece.color))
   							m.push([x-1,y-1]);
   						if(x+1<9 && squareClear(x+1,y,piece.color))
   							m.push([x+1,y]);
   						if(x+1<9 && y+1<9 && squareClear(x+1,y+1,piece.color))
   							m.push([x+1,y+1]);
   						if(x+1<9 && y-1>0 && squareClear(x+1,y-1,piece.color))
   							m.push([x+1,y-1]);
     					if(y-1>0 && squareClear(x,y-1,piece.color))
     						m.push([x,y-1]);
     					if(y+1<9 && squareClear(x,y+1,piece.color))
     						m.push([x,y+1]);
     				}
     			}
          piece.moves = m;
     		}
     	 }
     }

     drawBoard(){
       for(var x=1;x<9;x++){
         for (var y=1;y<9;y++){
           var  boardSquare = document.getElementById(x.toString() + "," + y.toString());
           var piece = this.getSquare([x,y]);
           if(piece == null)
             boardSquare.innerHTML = "";
           else{
             if(piece.color == "w" && piece.type == "pawn")
               boardSquare.innerHTML = w_pawn;
             if(piece.color == "w" && piece.type == "knight")
               boardSquare.innerHTML = w_knight;
             if(piece.color == "w" && piece.type == "rook")
               boardSquare.innerHTML = w_rook;
             if(piece.color == "w" && piece.type == "bishop")
               boardSquare.innerHTML = w_bishop;
             if(piece.color == "w" && piece.type == "queen")
               boardSquare.innerHTML = w_queen;
             if(piece.color == "w" && piece.type == "king")
               boardSquare.innerHTML = w_king;
             if(piece.color == "b" && piece.type == "pawn")
               boardSquare.innerHTML = b_pawn;
             if(piece.color == "b" && piece.type == "knight")
               boardSquare.innerHTML = b_knight;
             if(piece.color == "b" && piece.type == "rook")
               boardSquare.innerHTML = b_rook;
             if(piece.color == "b" && piece.type == "bishop")
               boardSquare.innerHTML = b_bishop;
             if(piece.color == "b" && piece.type == "queen")
               boardSquare.innerHTML = b_queen;
             if(piece.color == "b" && piece.type == "king")
               boardSquare.innerHTML = b_king;
           }
         }
       }
     }

     inCheck(color){
     	for(var x=1;x<9;x++){
     		for (var y=1;y<9;y++){
     			if(this.getSquare([x,y])!=null)
     				if(this.getSquare([x,y]).type=="king" && this.getSquare([x,y]).color==color)
     					var kingPos = [x,y];
     		}
     	}
     	for(x=1;x<9;x++){
     		for (y=1;y<9;y++){
     			if(this.getSquare([x,y])!=null){
     				if(this.getSquare([x,y]).color != color){
     					for(var i=0; i<this.getSquare([x,y]).moves.length; i++){
     						if(arraysEqual(this.getSquare([x,y]).moves[i],kingPos)){
     							return true;
     						}
     					}
     				}
     			}
     		}
     	}
     	return false;
     }

     mate(color){
     	if(color == "w")
     		var kingColor = "b";
     	else
     		var kingColor = "w";

     	if(this.inCheck(kingColor)){
     		var checkMate = true
        var updatedBoard = new Board(this.getTurn(), new Map(this.getSquares()));
     		for(var x=1;x<9;x++){
     			for (var y=1;y<9;y++){
            var piece = this.getSquare([x,y]);
     				if(piece!=null){
     					if(piece.color == kingColor){
     						var i = piece.moves.length-1;
     						var pos = [x,y];
                var validMoves = [];
     						while(i>0){
     							var move = this.getSquare(pos).moves[i];
     							var originalSquare = this.getSquare(move);

                  this.setSquare(move,this.getSquare(pos));
                  this.setSquare(pos,null);
     							this.computeMoves();

     							if(!this.inCheck(kingColor)){
     								checkMate = false
                    validMoves.push(move);
     							}

     							this.setSquare(pos,this.getSquare(move));
     							this.setSquare(move,originalSquare);
     							this.computeMoves();
     							i--;
     						}
                if(piece.type=="pawn"){
                  if(piece.type == "pawn" && piece.color == "w" && y==7){
                    var newPiece = Object.assign({'moves':validMoves,'type':piece.type,'color':piece.color,'started':false});
                  }
                  else if(piece.type == "pawn" && piece.color == "b" && y==2){
                    var newPiece = Object.assign({'moves':validMoves,'type':piece.type,'color':piece.color,'started':false});
                  }
                  else{
                    var newPiece = Object.assign({'moves':validMoves,'type':piece.type,'color':piece.color,'started':true});
                  }
                }
                else{
                  var newPiece = Object.assign({'moves':validMoves,'type':piece.type,'color':piece.color});
                }
                updatedBoard.setSquare(pos,newPiece);
     					}
     				}
     			}
     		}
        this.squares = updatedBoard.squares;
     		if(checkMate){
     			turnLabel.style.display = "none";
     			checkLabel.style.display = "block";
     			restart.style.display = "block";
     			checkLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px";
     			checkLabel.innerHTML = "CHECKMATE";
     		}
     		else{
     			check = true;
     			turnLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px";
     			checkLabel.style.padding = sixthPad + " 0px " + thirdPad + " 0px";
     			checkLabel.style.display = "block";
     			checkLabel.innerHTML = "CHECK";
     		}
     	}
     }

     checkUpgrade(){
     	var knight = document.getElementById("knight");
     	var bishop = document.getElementById("bishop");
     	var rook = document.getElementById("rook");
     	var queen = document.getElementById("queen");

     	for(var x=1;x<9;x++){
     		for (var y=1;y<9;y++){
          var piece = this.getSquare([x,y]);
     			if(piece != null){
     				if(piece.type == "pawn" && piece.color == "w" && y == 1){
     					text.style.display = "block";
     					upgradeBox.style.display = "block";
     					turnLabel.style.display = "none";
     					knight.innerHTML = w_knight;
     					bishop.innerHTML = w_bishop;
     					rook.innerHTML = w_rook;
     					queen.innerHTML = w_queen;
     					this.uX = x;
     					this.uY = y;
     				}
     				if(piece.type == "pawn" && piece.color == "b" && y == 8){
     					text.style.display = "block";
     					upgradeBox.style.display = "block";
     					turnLabel.style.display = "none";
     					knight.innerHTML = b_knight;
     					bishop.innerHTML = b_bishop;
     					rook.innerHTML = b_rook;
     					queen.innerHTML = b_queen;
     					this.uX = x;
     					this.uY = y;
     				}
     			}
     		}
     	}
     }

     upgrade(elem){
     	var selection = elem.id;
     	this.getSquare(this.uX,this.uY).type = selection;
     	document.getElementById("chessboard").style.margin = "auto";
     	turnLabel.style.display = "block";
     	text.style.display = "none"
     	upgradeBox.style.display = "none";
     	this.drawBoard();
     }

     scoreBoard(state){
     	var posScore=0;
     	var negScore=0;
     	for(var x=0;x<9;x++){
     		for(var y=0;y<9;y++){
     			if(this.getSquare([x,y]) != null){
     				if(this.getSquare([x,y]).color != 'b')
     					negScore ++;
     				else
     					posScore ++;
     			}
     		}
     	}
     	return posScore-negScore
     }
}

function computeChildren(node){
  var children = [];
  for(var x=0; x<9; x++){
    for(var y=0; y<9; y++){
      var piece = node.getSquare([x,y]);
      if(piece != null){
        if(piece.color == node.getTurn()){
          var turn = node.getTurn()
          var child = new Board(node.getTurn(),new Map(node.getSquares()));
          if(node.getTurn() == 'w'){
            child.setTurn('b');
          }
          else{
            child.setTurn('w');
          }
          for(var move of piece.moves){
            if(piece.type=="pawn"){
              if(piece.type == "pawn" && piece.color == "w" && y==7){
                var newPiece = Object.assign({'moves':new Map(piece.moves),'type':piece.type,'color':piece.color,'started':false});
              }
              else if(piece.type == "pawn" && piece.color == "b" && y==2){
                var newPiece = Object.assign({'moves':new Map(piece.moves),'type':piece.type,'color':piece.color,'started':false});
              }
              else{
                var newPiece = Object.assign({'moves':new Map(piece.moves),'type':piece.type,'color':piece.color,'started':true});
              }
            }
            else{
              var newPiece = Object.assign({'moves':new Map(piece.moves),'type':piece.type,'color':piece.color});
            }
            child.setSquare(move,newPiece);
            child.setSquare([x,y],null);
            child.computeMoves();
            children.push(child);
          }
        }
      }
    }
  }
  return children;
}

nodes = []

function boardsEqual(board1,board2){
  for(var x=0;x<9;x++){
    for(var y=0;y<9;y++){
      if(board1.getSquare([x,y])==null && board2.getSquare([x,y])!=null){
        return false;
      }
      else if(board1.getSquare([x,y])!=null && board2.getSquare([x,y])==null){
        return false;
      }
      else if(board1.getSquare([x,y])==null && board2.getSquare([x,y])==null){}
      else{
        if(!arraysEqual(board1.getSquare([x,y]).moves,board2.getSquare([x,y]).moves)){
          return false
        }
      }
    }
  }
  return true
}

function bestMove(node,depth,alpha,beta,maximizingPlayer){
  if(depth == 0){
    return node.scoreBoard();
  }

  if(maximizingPlayer){
    var v = -Infinity;
    for(var child of computeChildren(node)){
      v = Math.max(v,bestMove(child,depth-1,alpha,beta,false));
      var alpha = Math.max(alpha,v)
      if (beta <= alpha){
        break
      }
    }
    return v
  }
  else{
    var v = Infinity;
    for(var child of computeChildren(node)){
      v = Math.min(v,bestMove(child,depth-1,alpha,beta,true));
      var beta = Math.min(beta,v)
      if(beta <= alpha){
        break
      }
    }
    return v
  }
}

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function squareClear(x,y,color){
	if(mainBoard.getSquare([x,y]) == null || mainBoard.getSquare([x,y]).color != color)
	 return true
	else
	 return false;
}

function squareOpp(x,y,color){
	if(mainBoard.getSquare([x,y]) != null){
		if(mainBoard.getSquare([x,y]).color != color){
			return true;
    }
  }
	return false;
}

function resetGame(){
     mainBoard = new Board('w',null);
     mainBoard.initialize();
     mainBoard.drawBoard();
     mainBoard.computeMoves();

     restart.style.display = "none";
     checkLabel.innerHTML = "CHECK";
     checkLabel.style.display = "none";
     turnLabel.style.display = "block";
     turnLabel.innerHTML = "WHITE TURN";
     check = false;

     turnLabel.style.color = "ababab";
     turnLabel.style.padding = halfPad + " 0px " + halfPad + " 0px";
     checkLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px";
     restart.style.padding = sixthPad + " 0px " + thirdPad + " 0px";
}

function setCursor(elem){
	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			var boardSquare = document.getElementById(x.toString() + "," + y.toString());
			boardSquare.style.cursor = "default";
		}
	}
	var pos = elem.id;
	pos = [parseInt(pos[0]),parseInt(pos[2])];
	if(mainBoard.getSquare(pos) != null){
		if(pieceClicked == false){
			if(mainBoard.getSquare(pos).color == mainBoard.getTurn() && !arraysEqual(mainBoard.getSquare(pos).moves,[])){
				elem.style.cursor = "pointer";
				return;
			}
		}
	}
	if(pieceClicked){
		for(var i=0; i<mainBoard.getSquare(firstPos).moves.length; i++){
			if(arraysEqual(pos,mainBoard.getSquare(firstPos).moves[i])){
				elem.style.cursor = "pointer";
			}
		}
		return;
	}
}

function clicked(square){
	var pos = square.id;
	pos = [parseInt(pos[0]),parseInt(pos[2])];
	//$.post('/click', {'x': parseInt(pos[0]), 'y': parseInt(pos[1])}, function(data) {});
	if(pieceClicked == false && mainBoard.getSquare(pos) != null){
		if(mainBoard.getSquare(pos).color == mainBoard.getTurn()){
			pieceClicked = true;
			firstPos = pos;
		}
		square.style.cursor = "default";
	}
	else if(pieceClicked == true){
		pieceClicked = false;
		firstPiece = mainBoard.getSquare(firstPos);
		var validMove = false;

		for(var i=0; i<firstPiece.moves.length; i++){
			if(arraysEqual(firstPiece.moves[i],pos))
				validMove = true;
		}
		if(validMove){
			check = false;
			checkLabel.style.display = "none";
			turnLabel.style.padding = halfPad + " 0px " + halfPad + " 0px";
			if(mainBoard.getSquare(firstPos).type == "pawn")
				mainBoard.getSquare(firstPos).started = true;

      var originalSquare = mainBoard.getSquare(pos);

			mainBoard.setSquare(pos,mainBoard.getSquare(firstPos));
			mainBoard.setSquare(firstPos,null);
      mainBoard.computeMoves();

      if(mainBoard.inCheck(mainBoard.getTurn())){
        mainBoard.setSquare(firstPos,mainBoard.getSquare(pos));
        mainBoard.setSquare(pos, originalSquare);
        checkLabel.style.color = "ff0000";
        checkLabel.innerHTML = "INVALID MOVE";

        checkLabel.style.display = "block";
        turnLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px";
        checkLabel.style.padding = sixthPad + " 0px " + thirdPad + " 0px";
      }
      else{
        checkLabel.style.display = "none";
        checkLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px";
        turnLabel.style.padding = halfPad + " 0px " + halfPad + " 0px";

  			mainBoard.computeMoves();
  			mainBoard.checkUpgrade();
  			mainBoard.drawBoard();
  			mainBoard.mate(mainBoard.getTurn());

        if(mainBoard.getTurn() == 'w'){
          mainBoard.setTurn('b');
        }
        else{
          mainBoard.setTurn('w');
        }

  			turnLabel.style.color = "ababab";
  			if(mainBoard.getTurn() == "w")
  				turnLabel.innerHTML = "WHITE TURN";
  			else
  				turnLabel.innerHTML = "BLACK TURN";

        if(mainBoard.getTurn() == 'b'){
          var opt = bestMove(mainBoard,3,-Infinity,Infinity,true);
          console.log(opt);
        }
      }
		}
		else{
			pieceClicked = false;
		}
		square.style.cursor = "default";
  }
}
