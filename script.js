playerTurn = "w"
pieceClicked = false
firstPos = null

b_pawn = "&#9823"
b_knight = "&#9822"
b_bishop = "&#9821"
b_rook = "&#9820"
b_queen = "&#9819"
b_king = "&#9818"

w_pawn = "&#9817"
w_knight = "&#9816"
w_bishop = "&#9815"
w_rook = "&#9814"
w_queen = "&#9813"
w_king = "&#9812"

check = true

upgradeX = null
upgradeY = null

text = document.getElementById("text")
upgradeBox = document.getElementById("upgrades")
turnLabel = document.getElementById("turn")
checkLabel = document.getElementById("check")
restart = document.getElementById("restart")
checkLabel.style.display = "none"
text.style.display = "none"
upgradeBox.style.display = "none"
restart.style.display = "none"

baseHeight = ($("#body").height() - 640)/2
hFont = $("#header").css("font-size")
upgradesHeight = 50
uFont = 14
hFont = hFont.slice(0,hFont.length-2)

halfPad = ((baseHeight-hFont)/2).toString()
thirdPad = ((baseHeight-(2*hFont))/3).toString()
sixthPad = ((baseHeight-(2*hFont))/6).toString()
upgradePadThird = (((baseHeight)-uFont-upgradesHeight)/3).toString()
upgradePadSixth = (((baseHeight)-uFont-upgradesHeight)/6).toString()
document.getElementById("header").style.padding = halfPad + " 0px " + halfPad + " 0px"
upgradeBox.style.padding = upgradePadThird + " 0px " + upgradePadSixth + " 0px"
text.style.padding = upgradePadSixth + " 0px " + upgradePadThird + " 0px"

board = {}
initialize()

/*for(var x=0; x<9; x++){
	for(var y=0; y<9; y++){
		if(board[[x,y]] == null){
			$.post('/squares/' + x.toString() + y.toString(), {'type': null, 'color': null}, function(data) {
			});
		}
		else{
			$.post('/squares/' + x.toString() + y.toString(), {'type': board[[x,y]].type, 'color': board[[x,y]].color}, function(data) {
			});
		}
	}
}

var boardState = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/00', false);
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = xhr.responseText;
            }
        }
    };
    xhr.send(null);
    var data=xhr.responseText;
	var jsonResponse = JSON.parse(data);
	console.log(jsonResponse["Data"]);
}

boardState()*/

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function squareClear(x,y,color){
	if(board[[x,y]] != null)
		if(board[[x,y]].color != color)
			return true
		else
			return false
	else
		return true
}

function squareOpp(x,y,color){
	if(board[[x,y]] != null)
		if(board[[x,y]].color != color)
			return true
	return false
}

function setCursor(elem){
	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			var boardSquare = document.getElementById(x.toString() + "," + y.toString())
			boardSquare.style.cursor = "default"
		}
	}
	var pos = elem.id
	pos = [parseInt(pos[0])	,parseInt(pos[2])]
	if(board[pos] != null){
		if(pieceClicked == false){
			if(board[pos].color == playerTurn && !arraysEqual(board[pos].moves,[])){
				elem.style.cursor = "pointer"
				return
			}
		}
	}
	if(pieceClicked){
		for(var i=0; i<board[firstPos].moves.length; i++){
			if(arraysEqual(pos,board[firstPos].moves[i])){
				elem.style.cursor = "pointer"
			}
		}
		return
	}
}

function initialize(){
	restart.style.display = "none"
	checkLabel.innerHTML = "CHECK"
	checkLabel.style.display = "none"
	turnLabel.style.display = "block"
	turnLabel.innerHTML = "WHITE TURN"
	check = false
	playerTurn = "w"

	turnLabel.style.color = "ababab"
	turnLabel.style.padding = halfPad + " 0px " + halfPad + " 0px"
	checkLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px"
	restart.style.padding = sixthPad + " 0px " + thirdPad + " 0px"

	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			if(y<3 || y>6){
				var piece = []
				if(y<3)
					piece.color = "b"
				else
					piece.color = "w"
				piece.moves = []
				if(y==2 || y==7){
					piece.type="pawn"
					piece.started=false
				}
				else{
					if(x==1 || x==8){
						piece.type = "rook"
					}
					if(x==2 || x==7){
						piece.type = "knight"
					}
					if(x==3 || x==6){
						piece.type = "bishop"
					}
					if(x==4){
						piece.type = "queen"
					}
					if(x==5){
						piece.type = "king"
					}
				}
				board[[x,y]] = piece
			}
			else
				board[[x,y]] = null
		}
	}
	computeMoves()
	drawBoard()
}

function computeMoves(){
	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			if(board[[x,y]] != null){
				var m = []
				var piece = board[[x,y]]
				if(piece.type == "pawn"){
					if(piece.color == "w"){
						if(piece.started == false && board[[x,y-2]]==null){
							m.push([x,y-2])
						}
						if(y-1>0 && board[[x,y-1]]==null)
							m.push([x,y-1])
						if(x-1>0 && y-1>0 && squareOpp(x-1,y-1,piece.color))
							m.push([x-1,y-1])
						if(x+1<9 && y-1>0 && squareOpp(x+1,y-1,piece.color))
							m.push([x+1,y-1])
					}
					if(piece.color == "b"){
						if(piece.started == false && board[[x,y+2]]==null){
							m.push([x,y+2])
						}
						if(y+1<9 && board[[x,y+1]]==null)
							m.push([x,y+1])
						if(x-1>0 && y+1<9 && squareOpp(x-1,y+1,piece.color))
							m.push([x-1,y+1])
						if(x+1<9 && y+1<9 && squareOpp(x+1,y+1,piece.color))
							m.push([x+1,y+1])
					}
				}
				if(piece.type == "knight"){
					for(var mX=1;mX<3;mX++){
						for(var mY=1;mY<3;mY++){
							if(mX!=mY){
								if(x-mX>0 && y-mY>0 && squareClear(x-mX,y-mY,piece.color))
									m.push([x-mX,y-mY])
								if(x-mX>0 && y+mY<9 && squareClear(x-mX,y+mY,piece.color))
									m.push([x-mX,y+mY])
								if(x+mX<9 && y-mY>0 && squareClear(x+mX,y-mY,piece.color))
									m.push([x+mX,y-mY])
								if(x+mX<9 && y+mY<9 && squareClear(x+mX,y+mY,piece.color))
									m.push([x+mX,y+mY])
							}
						}
					}

				}
				if(piece.type == "bishop" || piece.type == "queen"){
					var mX = 1
					var mY = 1
					while(x+mX <9 && y+mY < 9){
						if(squareClear(x+mX,y+mY,piece.color))
							m.push([x+mX,y+mY])
						else{
							mX = 9-x
						}
						if(squareOpp(x+mX,y+mY,piece.color)){
							mX = 9-x
						}
						mX++
						mY++
					}
					mX = 1
					mY = 1
					while(x+mX <9 && y-mY > 0){
						if(squareClear(x+mX,y-mY,piece.color))
							m.push([x+mX,y-mY])
						else{
							mX = 9-x
						}
						if(squareOpp(x+mX,y-mY,piece.color)){
							mX = 9-x
						}
						mX++
						mY++
					}
					mX = 1
					mY = 1
					while(x-mX>0 && y+mY<9){
						if(squareClear(x-mX,y+mY,piece.color))
							m.push([x-mX,y+mY])
						else{
							mX = x
						}
						if(squareOpp(x-mX,y+mY,piece.color)){
							mX = x
						}
						mX++
						mY++
					}
					mX = 1
					mY = 1
					while(x-mX>0 && y-mY>0){
						if(squareClear(x-mX,y-mY,piece.color))
							m.push([x-mX,y-mY])
						else{
							mX = x
						}
						if(squareOpp(x-mX,y-mY,piece.color)){
							mX = x
						}
						mX++
						mY++
					}
				}
				if(piece.type == "rook" || piece.type == "queen"){
					for(mX=x+1;mX<9;mX++){
						if(squareClear(mX,y,piece.color))
							m.push([mX,y])
						else
							mX = 9
						if(squareOpp(mX,y,piece.color)){
							mX = 9
						}
					}
					for(mX=x-1;mX>0;mX--){
						if(squareClear(mX,y,piece.color))
							m.push([mX,y])
						else
							mX = 0
						if(squareOpp(mX,y,piece.color)){
							mX = 0
						}
					}
					for(mY=y+1;mY<9;mY++){
						if(squareClear(x,mY,piece.color))
							m.push([x,mY])
						else
							mY = 9
						if(squareOpp(x,mY,piece.color)){
							mY = 9
						}
					}
					for(mY=y-1;mY>0;mY--){
						if(squareClear(x,mY,piece.color))
							m.push([x,mY])
						else
							mY = 0
						if(squareOpp(x,mY,piece.color)){
							mY = 0
						}
					}
				}
				if(piece.type == "king"){
					if(x-1>0){
						if(squareClear(x-1,y,piece.color))
							m.push([x-1,y])
						if(y+1<9 && squareClear(x-1,y+1,piece.color))
							m.push([x-1,y+1])
						if(y-1>0 && squareClear(x-1,y-1,piece.color))
							m.push([x-1,y-1])
					}
					if(x+1<9){
						if(squareClear(x+1,y,piece.color))
							m.push([x+1,y])
						if(y+1<9 && squareClear(x+1,y+1,piece.color))
							m.push([x+1,y+1])
						if(y-1>0 && squareClear(x+1,y-1,piece.color))
							m.push([x+1,y-1])
					}
					if(y-1>0 && squareClear(x,y-1,piece.color))
						m.push([x,y-1])
					if(y+1<9 && squareClear(x,y+1,piece.color))
						m.push([x,y+1])
				}
				piece.moves = m
			}
		}
	}
}

function drawBoard(){
	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			boardSquare = document.getElementById(x.toString() + "," + y.toString())
			if(board[[x,y]] == null)
				boardSquare.innerHTML = ""
			else{
				if(board[[x,y]].color == "w" && board[[x,y]].type == "pawn")
					boardSquare.innerHTML = w_pawn
				if(board[[x,y]].color == "w" && board[[x,y]].type == "knight")
					boardSquare.innerHTML = w_knight
				if(board[[x,y]].color == "w" && board[[x,y]].type == "rook")
					boardSquare.innerHTML = w_rook
				if(board[[x,y]].color == "w" && board[[x,y]].type == "bishop")
					boardSquare.innerHTML = w_bishop
				if(board[[x,y]].color == "w" && board[[x,y]].type == "queen")
					boardSquare.innerHTML = w_queen
				if(board[[x,y]].color == "w" && board[[x,y]].type == "king")
					boardSquare.innerHTML = w_king
				if(board[[x,y]].color == "b" && board[[x,y]].type == "pawn")
					boardSquare.innerHTML = b_pawn
				if(board[[x,y]].color == "b" && board[[x,y]].type == "knight")
					boardSquare.innerHTML = b_knight
				if(board[[x,y]].color == "b" && board[[x,y]].type == "rook")
					boardSquare.innerHTML = b_rook
				if(board[[x,y]].color == "b" && board[[x,y]].type == "bishop")
					boardSquare.innerHTML = b_bishop
				if(board[[x,y]].color == "b" && board[[x,y]].type == "queen")
					boardSquare.innerHTML = b_queen
				if(board[[x,y]].color == "b" && board[[x,y]].type == "king")
					boardSquare.innerHTML = b_king
			}
		}
	}
}

function safeMove(pos,kingPos,color){
	board[pos] = board[kingPos]
	board[kingPos] = null
	check = false
	checkLabel.style.display = "none"
	turnLabel.style.padding = halfPad + " 0px " + halfPad + " 0px"
	if(playerTurn == "b")
		playerTurn = "w"
	else
		playerTurn = "b"

	if(playerTurn == "w")
		turnLabel.innerHTML = "WHITE TURN"
	else
		turnLabel.innerHTML = "BLACK TURN"
	drawBoard()
}

function inCheck(color){
	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			if(board[[x,y]]!=null)
				if(board[[x,y]].type=="king" && board[[x,y]].color==color)
					var kingPos = [x,y]
		}
	}
	for(x=1;x<9;x++){
		for (y=1;y<9;y++){
			if(board[[x,y]]!=null){
				if(board[[x,y]].color != color){
					for(var i=0; i<board[[x,y]].moves.length; i++){
						if(arraysEqual(board[[x,y]].moves[i],kingPos)){
							return true
						}
					}
				}
			}
		}
	}
	return false
}

function mate(color){
	if(color == "w")
		var kingColor = "b"
	else
		var kingColor = "w"

	if(inCheck(kingColor)){
		var checkMate = true
		for(var x=1;x<9;x++){
			for (var y=1;y<9;y++){
				if(board[[x,y]]!=null){
					if(board[[x,y]].color == kingColor){
						var i = board[[x,y]].moves.length-1
						var pos = [x,y]
						while(i>0){
							var move = board[pos].moves[i]
							var originalSquare = board[move]

							board[move] = board[pos]
							board[pos] = null
							computeMoves()
							if(!inCheck(kingColor)){
								checkMate = false
							}

							board[pos] = board[move]
							board[move] = originalSquare
							computeMoves()
							i--
						}
					}
				}
			}
		}
		if(checkMate){
			turnLabel.style.display = "none"
			checkLabel.style.display = "block"
			restart.style.display = "block"
			checkLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px"
			checkLabel.innerHTML = "CHECKMATE"
		}
		else{
			check = true
			turnLabel.style.padding = thirdPad + " 0px " + sixthPad + " 0px"
			checkLabel.style.padding = sixthPad + " 0px " + thirdPad + " 0px"
			checkLabel.style.display = "block"
			checkLabel.innerHTML = "CHECK"
		}
	}
}

function checkUpgrade(){
	var knight = document.getElementById("knight")
	var bishop = document.getElementById("bishop")
	var rook = document.getElementById("rook")
	var queen = document.getElementById("queen")
	for(var x=1;x<9;x++){
		for (var y=1;y<9;y++){
			if(board[[x,y]] != null){
				if(board[[x,y]].type == "pawn" && board[[x,y]].color == "w" && y == 1){
					text.style.display = "block"
					upgradeBox.style.display = "block"
					turnLabel.style.display = "none"
					knight.innerHTML = w_knight
					bishop.innerHTML = w_bishop
					rook.innerHTML = w_rook
					queen.innerHTML = w_queen
					upgradeX = x
					upgradeY = y
				}
				if(board[[x,y]].type == "pawn" && board[[x,y]].color == "b" && y == 8){
					text.style.display = "block"
					upgradeBox.style.display = "block"
					turnLabel.style.display = "none"
					knight.innerHTML = b_knight
					bishop.innerHTML = b_bishop
					rook.innerHTML = b_rook
					queen.innerHTML = b_queen
					upgradeX = x
					upgradeY = y
				}
			}
		}
	}
}

function upgrade(elem){
	var selection = elem.id
	board[[upgradeX,upgradeY]].type = selection
	document.getElementById("chessboard").style.margin = "auto"
	turnLabel.style.display = "block"
	text.style.display = "none"
	upgradeBox.style.display = "none"
	drawBoard()
}

function clicked(square){
	var pos = square.id
	pos = [parseInt(pos[0]),parseInt(pos[2])]
	//$.post('/click', {'x': parseInt(pos[0]), 'y': parseInt(pos[1])}, function(data) {});

	if(pieceClicked == false && board[pos] != null){
		if(board[pos].color == playerTurn){
			pieceClicked = true
			firstPos = pos
		}
		square.style.cursor = "default"
	}
	else if(pieceClicked == true){
		pieceClicked = false
		firstPiece = board[firstPos]
		var validMove = false

		for(var i=0; i<firstPiece.moves.length; i++){
			if(arraysEqual(firstPiece.moves[i],pos))
				validMove = true
		}
		if(validMove){
			check = false
			checkLabel.style.display = "none"
			turnLabel.style.padding = halfPad + " 0px " + halfPad + " 0px"
			if(board[firstPos].type == "pawn")
				board[firstPos].started = true
			originalSquare = board[pos]

			board[pos] = board[firstPos]
			board[firstPos] = null
			computeMoves()
			if(inCheck(playerTurn)){
				board[firstPos] = board[pos]
				board[pos] = originalSquare
				turnLabel.style.color = "ff0000"
				turnLabel.innerHTML = "INVALID MOVE"
			}
			else{
				checkUpgrade()
				drawBoard()
				mate(playerTurn)
				console.log(scoreBoard(board,playerTurn))
				if(playerTurn == "w")
					playerTurn = "b"
				else
					playerTurn = "w"

				turnLabel.style.color = "ababab"
				if(playerTurn == "w")
					turnLabel.innerHTML = "WHITE TURN"
				else
					turnLabel.innerHTML = "BLACK TURN"
			}
		}
		else{
			pieceClicked = false
		}
		square.style.cursor = "default"
	}
}

function scoreBoard(state,color){
	var posScore=0
	var negScore=0
	for(var x=0;x<9;x++){
		for(var y=0;y<9;y++){
			if(state[[x,y]] != null){
				if(state[[x,y]].color != color)
					negScore ++
				else
					posScore ++
			}
		}
	}
	return posScore-negScore
}

// create a graph class
class Graph {
    // defining vertex array and
    // adjacent list
    constructor()
    {
        this.AdjList = new Map();
	   this.WeightList = new Map();
    }

    // functions to be implemented

    // add vertex to the graph
    addVertex(v,w){
	    // initialize the adjacent list with a
	    // null array
	    this.AdjList.set(v, []);
	    this.WeightList.set(v,w);
	}
    // addEdge(v, w)
    // add edge to the graph
	addEdge(v, w){
	    // get the list for vertex v and put the
	    // vertex w denoting edge betweeen v and w
	    this.AdjList.get(v).push(w);

	    // Since graph is undirected,
	    // add an edge from w to w also
	    this.AdjList.get(w).push(v);
	}
	// Prints the vertex and adjacency list
	printGraph(){
	    // get all the vertices
	    var get_keys = this.AdjList.keys();

	    // iterate over the vertices
	    for (var i of get_keys){
	        // great the corresponding adjacency list
	        // for the vertex
	        var get_values = this.AdjList.get(i);
	        var conc = "";

	        // iterate over the adjacency list
	        // concatenate the values into a string
	        for (var j of get_values)
	            conc += j + " ";

	        // print the vertex and its adjacency list
	        console.log(i + " -> " + conc + " weight " + this.WeightList.get(i));
	    }
	}
}
