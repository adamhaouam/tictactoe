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

    return {
        getBoard
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