function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let i = 0; i < columns; i++) {
            board[i].push(Square());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
		const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSquare()).join(', ')).join('\n');
		console.log(boardWithCellValues);
	};

    return {
        getBoard,
        printBoard
    }
}




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