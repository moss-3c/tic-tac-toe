function Cell() {
    let value = ''; // 0 = neither player's cell

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue,
    };
}

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //nested loop for 2d array
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    //used for rendering
    const getBoard = () => board;

    //col 0, col1, col2
    const placeToken = (column, row, playerToken) => {
        board[row][column].addToken(playerToken);
    }



    const isCellFree = (column, row) => 
        board[row][column].getValue() === '';

    return {
        getBoard,
        placeToken,
        isCellFree,
    }
}

function GameController(
    p1Name = "Player One",
    p2Name = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: p1Name,
            token: 'X',
        },
        {
            name: p2Name,
            token: 'O',
        }
    ];

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = (activePlayer === players[0] ?
            players[1] :
            players[0]);
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
    }

    const playRound = (column, row) => {

        if (!board.isCellFree(column, row)) {
            return;
        }

        console.log(`${getActivePlayer().name} has placed their mark in 
            column ${column}, row ${row}`);
        board.placeToken(column, row, getActivePlayer().token);

        //check for winner or tie
        const winner = checkWinner();

        //todo
         switchTurn();
         printNewRound();
    }

    //returns winner if there is one, returns tie if tie, else returns null
    const checkWinner = () => {
        if (hasWon(players[0].token)) {
            return players[0];
        }
        if (hasWon(players[1].token)) {
            return players[1];
        }


   
    }

    const hasWon = (playerToken) => {
        const boardArray = [];
        board.getBoard().map (
            (row) => row.map(
                (cell) => boardArray.push(cell.getValue())));
        const magicSquare = [4, 9, 2, 3, 5, 6, 7, 1, 6];

        //comparing all combos of 3 cells, see if their sum in the magic square equals 15
        //idea from https://fowlie.github.io/2018/08/24/winning-algorithm-for-tic-tac-toe-using-a-3x3-magic-square/, thank you!
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                for (let k = 0; k < 9; k++) {
                    if (i != j && i != k && j != k) {//don't compare cell with itself
                        if (board[i] === playerToken && 
                            board[j] === playerToken && 
                            board[k] === playerToken){
                            if (Math.sum(magicSquare[i], magicSquare[j], magicSquare[k]) === 15){
                                return true;
                            }
                            return false;
                        }}}}} 
    }

    //for first round
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        
    }
}

function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');

    const updateScreen = () => {
        //erase old content
        boardDiv.textContent = '';
        const board = game.getBoard();

        //update player turn
        const activePlayer = game.getActivePlayer();
        turnDiv.textContent = `${activePlayer.name}'s turn`;

        //rendering cells
        board.forEach (row => {
            row.forEach((cell, colIndex, rowArray) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = board.indexOf(rowArray);
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        //exclude gaps
        if (!selectedColumn)
            return;

        game.playRound(selectedColumn, selectedRow);
        updateScreen();
    }

    updateScreen();
    boardDiv.addEventListener('click', clickHandlerBoard);

}

ScreenController();

//check/display ties/wins
//restart game
//computer's turn