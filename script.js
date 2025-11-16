"use strict";

function Gameboard() {
    const rows = 3;
    const columns = 3;
    let squaresFilled = 0;
    const board = [];

    //Generate board and add squares
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let a = 0; a < columns; a++) {
            board[i].push(Square());
        }
    };
	
	const getBoard = () => board;
	
	// const printBoard = () => {
	// 	const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSquare()).join(', ')).join('\n');
	// 	console.log(boardWithCellValues);
	// };
	
    //Checks if square is empty (has '-' as current token)
    const checkEmpty = (row, column) => (board[row][column].getSquare() == "-");

    //Takes current user's token and sets in cell if it is empty else returns false
	const setCell = (token, row, column) => {
        if (checkEmpty(row, column)) {
            board[row][column].setSquare(token);
            squaresFilled++;
            return true;
        }
        else return false;
    }

    //Checks if the board has been filled
    const isFull = () => (squaresFilled == rows * columns);

    //Checks if any win has occured yet
	const checkWin = () => {
		let winFound;
		for (let a = 0; a < 3; a++) { //check for row win
            if (board[a][0].getSquare() == board[a][1].getSquare() && board[a][1].getSquare() == board[a][2].getSquare() && board[a][0].getSquare() != "-") {
				//console.log(`Found on row ${a}`);
				winFound = board[a][0].getSquare();
			}
		}
		
		for (let a = 0; a < 3; a++) { // check for column win
			if (board[0][a].getSquare() == board[1][a].getSquare() && board[1][a].getSquare() == board[2][a].getSquare() && board[2][a].getSquare() != "-") {
				//console.log(`Found on column ${a}`);
				winFound = board[0][a].getSquare();
			}        
		}
		
		//Check for diagonal win
		if ((board[0][0].getSquare() == board[1][1].getSquare() && board[1][1].getSquare() == board[2][2].getSquare() && board[2][2].getSquare() != "-") || 
		(board[0][2].getSquare() == board[1][1].getSquare() && board[1][1].getSquare() == board[2][0].getSquare() && board[2][0].getSquare() != "-")) {
			//console.log("Found on diagonal");
			winFound = board[0][0].getSquare();
		}
		return winFound;
	};

    //clears array and adds new Squares, sets squaresFilled to zero
    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let a = 0; a < columns; a++) {
                board[i].push(Square());
            }
        };
        squaresFilled = 0;
    }
	
	return {
		getBoard,
		//printBoard,
		setCell,
        checkWin,
        isFull,
        resetBoard
	};
};

function Square() {
    let value = "-"; //Default value

    //sets square value to provided token
    const setSquare = (playerToken) => {
        value = playerToken;
    }

    const getSquare = () => value;

    return {
        setSquare,
        getSquare
    };
}



function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
    
	const board = Gameboard();
    let winStatus = "";
	
	const players = [
    {
      name: playerOneName,
      token: "o"
    },
    {
      name: playerTwoName,
      token: "x"
    }
  ];
  
	let currentPlayer = players[0];
	
	const switchPlayerTurn = () => {
		currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
	};
	
	const getCurrentPlayer = () => currentPlayer;
	
    //Resets board, win status and turn
	const resetBoard = () => {
        currentPlayer = players[0];
        winStatus = "";
        board.resetBoard();
    }

    //Attempts to place token on selected row and column
	const playRound = (row, column) => {
        if (!board.setCell(currentPlayer.token, row, column)) {
            alert("Taken! Try again");
        }      

        //After setting cell, checks if game has won or tied, swaps player if it hasn't
        else if (!board.checkWin() && !board.isFull()) {
            switchPlayerTurn(); 
            return (`${currentPlayer.name}'s turn`) 
	        
        }
        
        //Checks if a win exists on the board
        else if (board.checkWin()) {
            winStatus = currentPlayer.name;
            return (`Winner is ${currentPlayer.name}!`);
        }
        //Calls tie if board is full but there is no win found
        else {
            winStatus = "tie";
            return ("It's a tie!");
        }
	};
	
    const getWinStatus = () => winStatus;

    const updatePlayerNames = (playerOneName, playerTwoName) => {
        players[0].name = playerOneName || "Player One";
        players[1].name = playerTwoName || "Player Two";
    }
    
	
	return {
		getCurrentPlayer,
		playRound,
        getWinStatus,
        resetBoard,
        updatePlayerNames,
        getBoard: board.getBoard
	};
	
}



function ScreenController() {
	const game = GameController();
    const playerOneName = document.querySelector('#playerOneName');
    const playerOneColor = document.querySelector('#playerOneColor');
    const playerTwoName = document.querySelector('#playerTwoName');
    const playerTwoColor = document.querySelector('#playerTwoColor');
	const playerTurnDiv = document.querySelector('.turn');
	const boardDiv = document.querySelector('.board');
    const menuBox = document.querySelector('.menu');
    const gameBox = document.querySelector('.game');
    const startButton = document.querySelector('.startButton');
    const resetButton = document.querySelector('.reset');
    const menuButton = document.querySelector('.return');
	
	const updateScreen = () => {
		boardDiv.textContent = '';
		
		const board = game.getBoard();
		board.forEach((row, index1) => {
			row.forEach((square, index2) => {
				const squareButton = document.createElement("button");
				squareButton.classList.add("square");
                squareButton.textContent = square.getSquare();
                
                //Sets respective player colours on their squares
                //Could be added to players object in future
                if (squareButton.textContent == "o" && playerOneColor.value != "#000000") squareButton.style.backgroundColor = playerOneColor.value;
                if (squareButton.textContent == "x" && playerTwoColor.value != "#000000") squareButton.style.backgroundColor = playerTwoColor.value;
                squareButton.classList.add(square.getSquare());
                squareButton.dataset.row = index1;
				squareButton.dataset.column = index2;
                boardDiv.appendChild(squareButton);
			})	
		})
	};
	
    //Runs if board is clicked, checks if a square was selected
    function clickBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        let result = "";
        if (!selectedRow || !selectedColumn) return;

        //Plays a round, sets title as result of turn (win status or turn)
        result = game.playRound(selectedRow, selectedColumn);
        playerTurnDiv.textContent = result;

        //Removes event listener if game has reached conclusion
        if (game.getWinStatus() != "") { 
            boardDiv.removeEventListener("click", clickBoard);
        }
        
        updateScreen();
    }

    //Resets all properties of game
    function resetGame() {
        game.resetBoard();
        updateScreen();
        boardDiv.addEventListener("click", clickBoard);
        let startingPlayer = game.getCurrentPlayer();
        playerTurnDiv.textContent = `${startingPlayer.name}'s turn`;
    }

    //Hides board, opens menu
    function openMenu() {
        //clear game
        //add menu features
        gameBox.style.display = "none";
        menuBox.style.display = "flex";
    }

    //Hides menu, opens board,  updates player object with names filled in menu
    function startGame() {
        menuBox.style.display = "none";
        gameBox.style.display = "flex";
        game.updatePlayerNames(playerOneName.value, playerTwoName.value);
        console.log(playerOneColor.value)
        resetGame();
    }
    
    startButton.addEventListener("click", startGame);
    resetButton.addEventListener("click", resetGame);
    menuButton.addEventListener("click", openMenu);

    openMenu();
}

ScreenController();