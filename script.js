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

    const setSquare = (player) => {
        value = player;
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
	const playRound = () => {
		printNewRound();
        console.log(`${getCurrentPlayer().name}'s turn.`);
        input = prompt("Input:");
        while (!board.setCell(currentPlayer.token, input[0],input[1])) {
            input = prompt("Taken! Try again:");
        }
        switchPlayerTurn();  
	};
	
	while (!board.checkWin() && !board.isFull()){
        playRound();
    }
    
    if (board.checkWin()) {
        switchPlayerTurn();
	    console.log("done, winnier is ", currentPlayer.name);
    }
    else console.log("It's a tie!");
    
	
	return {
		getCurrentPlayer,
		playRound
	};
}



function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector('.turn');
	const boardDiv = document.querySelector('.board');
	

}

ScreenController();