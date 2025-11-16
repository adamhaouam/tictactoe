"use strict";

function Gameboard() {
    const rows = 3;
    const columns = 3;
    let squaresFilled = 0;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let a = 0; a < columns; a++) {
            board[i].push(Square());
        }
    };
	
	const getBoard = () => board;
	
	const printBoard = () => {
		const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSquare()).join(', ')).join('\n');
		console.log(boardWithCellValues);
	};
	
    const checkEmpty = (row, column) => (board[row][column].getSquare() == "-");

	const setCell = (token, row, column) => {
        if (checkEmpty(row, column)) {
            board[row][column].setSquare(token);
            squaresFilled++;
            return true;
        }
        else return false;
    }


    const isFull = () => (squaresFilled == rows * columns);

	const checkWin = () => {
		let winFound;
		for (let a = 0; a < 3; a++) { //check for row win
            if (board[a][0].getSquare() == board[a][1].getSquare() && board[a][1].getSquare() == board[a][2].getSquare() && board[a][0].getSquare() != "-") {
				console.log(`Found on row ${a}`);
				winFound = board[a][0].getSquare();
			}
		}
		
		for (let a = 0; a < 3; a++) { // check for column win
			if (board[0][a].getSquare() == board[1][a].getSquare() && board[1][a].getSquare() == board[2][a].getSquare() && board[2][a].getSquare() != "-") {
				console.log(`Found on column ${a}`);
				winFound = board[0][a].getSquare();
			}        
		}
		
		//Check for diagonal win
		if ((board[0][0].getSquare() == board[1][1].getSquare() && board[1][1].getSquare() == board[2][2].getSquare() && board[2][2].getSquare() != "-") || 
		(board[0][2].getSquare() == board[1][1].getSquare() && board[1][1].getSquare() == board[2][0].getSquare() && board[2][0].getSquare() != "-")) {
			console.log("Found on diagonal");
			winFound = board[0][0].getSquare();
		}
		return winFound;
	};

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
		printBoard,
		setCell,
        checkWin,
        isFull,
        resetBoard
	};
};

function Square() {
    let value = "-";

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
	
	const resetBoard = () => {
        //reset win functions
        currentPlayer = players[0];
        winStatus = "";
        board.resetBoard();
    }

	const playRound = (row, column) => {
        if (!board.setCell(currentPlayer.token, row, column)) {
            alert("Taken! Try again");
        }      

        else if (!board.checkWin() && !board.isFull()) {
            switchPlayerTurn(); 
            return (`${currentPlayer.name}'s turn`) 
	        
        }
        else if (board.checkWin()) {
            winStatus = currentPlayer.name;
            return (`Winner is ${currentPlayer.name}!`);
        }
        else {
            winStatus = "tie";
            return ("It's a tie!");
        }
	};
	
    const getWinStatus = () => winStatus;
    
	
	return {
		getCurrentPlayer,
		playRound,
        getWinStatus,
        resetBoard,
        getBoard: board.getBoard
	};
	
}



function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector('.turn');
	const boardDiv = document.querySelector('.board');
    //const container = document.querySelector('.container');
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
                squareButton.classList.add(square.getSquare());
                squareButton.dataset.row = index1;
				squareButton.dataset.column = index2;
                boardDiv.appendChild(squareButton);
			})	
		})
	};
	
    function clickBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        let result = "";
        if (!selectedRow || !selectedColumn) return;

        //return result and react
        result = game.playRound(selectedRow, selectedColumn);
        playerTurnDiv.textContent = result;

        //Removes event listener if game has reached conclusion
        if (game.getWinStatus() != "") { 
            boardDiv.removeEventListener("click", clickBoard);
        }
        
        updateScreen();
    }

    function resetGame() {
        game.resetBoard();
        updateScreen();
        boardDiv.addEventListener("click", clickBoard);
        let startingPlayer = game.getCurrentPlayer();
        playerTurnDiv.textContent = `${startingPlayer.name}'s turn`;
    }

    
    function openMenu() {
        //clear game
        //add menu features
        gameBox.style.display = "none";
        menuBox.style.display = "block"
    }

    function startGame() {
        resetGame();
        menuBox.style.display = "none";
        gameBox.style.display = "block";
    }
    
    startButton.addEventListener("click", startGame);
    resetButton.addEventListener("click", resetGame);
    menuButton.addEventListener("click", openMenu);

    openMenu();
}

ScreenController();