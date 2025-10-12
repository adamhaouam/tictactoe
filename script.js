function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //Create rows and columns, insert Square 
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let i = 0; i < columns; i++) {
            board[i].push(Square());
        }
    }

    const getBoard = () => board;

    const setCell = (token, row, column) => board[row][column].setSquare(token);

    const printBoard = () => {
		const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSquare()).join(', ')).join('\n');
		console.log(boardWithCellValues);
	};

    const checkWin = () => {
		let winFound = false;
		console.log("checking...");
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
		
		if (winFound == true) console.log("win!") 
			else console.log("nope!");
		
		return winFound;
	};

    return {
        getBoard,
        printBoard,
        setCell,
        checkWin
    }
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
		console.log(`Placing x on row ${row}, column ${column}`);
		board.setCell(currentPlayer.token, row,column);
		printNewRound();
	};
	
	
	do {
		console.log(`${getCurrentPlayer().name}'s turn.`);
		input = prompt("Input:");
		playRound(input[0],input[1]);
		switchPlayerTurn();
	} while (!board.checkWin());
	switchPlayerTurn();	
	console.log("done, winnier is ", currentPlayer.token);
	
	return {
		getCurrentPlayer,
		playRound
	};
}

const game = GameController();





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