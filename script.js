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
	
    const checkEmpty = (row, column) => (board[row][column].getSquare() == 0);

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
		let winFound = false;
		for (let a = 0; a < 3; a++) { //check for row win
            if (board[a][0].getSquare() == board[a][1].getSquare() && board[a][1].getSquare() == board[a][2].getSquare() && board[a][0].getSquare() != 0) {
				console.log(`Found on row ${a}`);
				winFound = true;
			}
		}
		
		for (let a = 0; a < 3; a++) { // check for column win
			if (board[0][a].getSquare() == board[1][a].getSquare() && board[1][a].getSquare() == board[2][a].getSquare() && board[2][a].getSquare() != 0) {
				console.log(`Found on column ${a}`);
				winFound = true;
			}        
		}
		
		//Check for diagonal win
		if ((board[0][0].getSquare() == board[1][1].getSquare() && board[1][1].getSquare() == board[2][2].getSquare() && board[2][2].getSquare() != 0) || 
		(board[0][2].getSquare() == board[1][1].getSquare() && board[1][1].getSquare() == board[2][0].getSquare() && board[2][0].getSquare() != 0)) {
			console.log("Found on diagonal");
			winFound = true;
		}
		return winFound;
	};
	
	return {
		getBoard,
		printBoard,
		setCell,
        checkWin,
        isFull
	};
};

function Square() {
    let value = 0;

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
	
	const printNewRound = () => {
		board.printBoard();
	}
    

	const playRound = (row, column) => {
        if (!board.setCell(currentPlayer.token, row, column)) {
            alert("Taken! Try again:");
        }      

        else if (!board.checkWin() && !board.isFull()) {
            switchPlayerTurn(); 
            return ("No win yet!")
	        
        }
        else {
            return ("done, either tie or winnier is ", currentPlayer.name);
        }
	};
	

    
	
	return {
		getCurrentPlayer,
		playRound,
        getBoard: board.getBoard
	};
}



function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector('.turn');
	const boardDiv = document.querySelector('.board');
	
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
        let result = "git";
        if (!selectedRow || !selectedColumn) return;

        //return result and react
        
        result = game.playRound(selectedRow, selectedColumn)
        console.log(result);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickBoard);
    //if gameover remove event listener

	updateScreen();


    //if board is full say tie
    //else report winner

}

ScreenController();