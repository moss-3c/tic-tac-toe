function Cell() {
    let value = ''; // 0 = neither player's cell

    const addToken = (player) => {
        value = player;
    }
    const clearValue = () => value = '';

    const getValue = () => value;

   

    return {
        addToken,
        getValue,
        clearValue,
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

    const clearBoard = () => {
        board.forEach(
            row => row.forEach(
                cell => cell.clearValue()
            )
        )
    }

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
        clearBoard
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
    let matchResult = 'in-progress';

    const switchTurn = () => {
        activePlayer = (activePlayer === players[0] ?
            players[1] :
            players[0]);
    }

    const getActivePlayer = () => activePlayer;

    const getMatchResult = () => matchResult;

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
    }

    const playRound = (column, row) => {

        if (!board.isCellFree(column, row) ||
            !(matchResult === 'in-progress')) {
            return;
        }

        console.log(`${getActivePlayer().name} has placed their mark in 
            column ${column}, row ${row}`);
        board.placeToken(column, row, getActivePlayer().token);

        //check for winner or tie
        updateResult();

        //if winner..if tie...if null...
         if (matchResult === 'tie') {
             console.log("It's a tie");
         }
         else if (matchResult === 'in-progress') {
             console.log("in progress")
             switchTurn();
         }
         else {
             console.log(`${matchResult.name} wins`);
             //todo: prevent further input
         }
       
    }

    //returns winner if there is one, returns tie if tie, else returns null
    const updateResult = () => {
        if (hasWon(players[0].token)) {
            matchResult = players[0];
        }
        else if (hasWon(players[1].token)) {
            matchResult = players[1];
        }
        else if (checkTie()){
            matchResult = 'tie';
        }
        else {
            matchResult = 'in-progress';
        }

    }
    const checkTie = () => {
        const values = extractValues();
        return !values.includes('');
    }

    const hasWon = (playerToken) => {
        const values = extractValues();
        const magicSquare = [2, 7, 6, 9, 5, 1, 4, 3, 8];

        //comparing all combos of 3 cells, see if their sum in the magic square equals 15
        //idea from https://fowlie.github.io/2018/08/24/winning-algorithm-for-tic-tac-toe-using-a-3x3-magic-square/
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                for (let k = 0; k < 9; k++) {
                    if (i != j && i != k && j != k) {//don't compare cell with itself
                        if (values[i] === playerToken && 
                            values[j] === playerToken && 
                            values[k] === playerToken){
                            if ((magicSquare[i] + magicSquare[j] + magicSquare[k]) == 15){
                                return true;
                            }
                            return false;
                        }}}}} 
    }

    const extractValues = () => {
        const values = [];
        board.getBoard().map (
            (row) => row.map(
                (cell) => values.push(cell.getValue())));
        return values;
    } 

    const restartGame = () => {
        activePlayer = players[0];
        matchResult = 'in-progress';
        board.clearBoard();
        printNewRound();
    }



    //for first round
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getMatchResult,
        getBoard: board.getBoard,
        restartGame,
        
    }
}

function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');
    const restartButton = document.querySelector('.restart');

    const updateScreen = () => {
        //erase old content
        boardDiv.textContent = '';
        const board = game.getBoard();
        const matchResult = game.getMatchResult();

        if (matchResult === 'in-progress') {
            //update player turn
            const activePlayer = game.getActivePlayer();
            turnDiv.textContent = `${activePlayer.name}'s turn`;
        }
        else if (matchResult === 'tie') {
            turnDiv.textContent = "It's a tie";
        }
        else {
            turnDiv.textContent = `${matchResult?.name} wins!`;
        }
     

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

        const matchResult = game.playRound(selectedColumn, selectedRow);
        updateScreen();

    }

    function clickHandlerRestart() {
        game.restartGame();
        updateScreen();
    }

    updateScreen();
    boardDiv.addEventListener('click', clickHandlerBoard);
    restartButton.addEventListener('click', clickHandlerRestart);

}

ScreenController();

//check/display ties/wins
//restart game
//computer's turn