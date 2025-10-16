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

function GameController() {
    const board = Gameboard();

    const players = [
        {
            name: "Player One",
            token: 'X',
        },
        {
            name: "Player Two",
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
        const winner = checkWinner();
        if (winner) {  //winner is false if no winner, winner is an object with 2 keys if there is a winner
            if (winner.patternToken === "X") {
                matchResult = players[0];
            }
            else {
                matchResult = players[1];
            }
            
        }
        else if (isTie()){
            matchResult = 'tie';
        }
        else {
            matchResult = 'in-progress';
        }


    }
    const isTie = () => {
        const values = [];
        board.getBoard().map (
            (row) => row.map(
                (cell) => values.push(cell.getValue())));
        return !values.includes('');
    }
    const checkWinner = () => {
        const rows = getHorizontals();

        let winnerObj = hasWinningPattern(rows);
        if(winnerObj != false) {
            return winnerObj;
        }
        const columns = getVerticals();
        winnerObj = hasWinningPattern(columns);
        if(winnerObj != false) {
            return winnerObj;
        }
        const diagonals = getDiagonals();
        winnerObj = hasWinningPattern(diagonals);
        if(winnerObj != false) {
            return winnerObj;
        }
        return false;

    }
    const hasWinningPattern = (array) => {
        for (let i = 0; i < array.length; i++) {
            if(winnerObj = isWinningPattern(array[i])) {
                //if true ie returned obj
                return winnerObj;
            }
        }
        return false;
        
    }
    const isWinningPattern = (tokenArray) => {
        if(tokenArray[0] != '' && 
            tokenArray.every(token => token === tokenArray[0]))
                return {
                    hasPattern: true,
                    patternToken: tokenArray[0],
                }
        else {
            return false;
        }
    }
    const getHorizontals = () => {
        const boardCells = board.getBoard();
        let horizontals = [];
        for (let i = 0; i < boardCells.length; i++) {
            horizontals.push([]);
        }
        for (let i = 0; i < boardCells.length; i++) {
            for (let j = 0; j < boardCells.length; j++) {
                horizontals[i][j] = boardCells[i][j].getValue();
            }
        }
        
        return horizontals;
    }
    const getVerticals = () => {
        const boardCells = board.getBoard();
        let verticals = []
        for (let i = 0; i < boardCells.length; i++) {
            verticals.push([]);
        }
        for (let i = 0; i < boardCells.length; i++) {
            for (let j = 0; j < boardCells.length; j++) {
                verticals[j].push(boardCells[i][j].getValue());
            }
        }
        return verticals;
    }
        
    
    const getDiagonals = () => {
        const boardCells = board.getBoard();
        let diag1 = [];
        let diag2 = [];
        for (let i = 0; i < boardCells.length; i++) {
            diag1.push(boardCells[i][i].getValue());
        }
        for (let i = 0; i < boardCells.length; i++) {
            diag2.push(boardCells[i][boardCells.length - 1 - i].getValue());
        }
        return [diag1, diag2];
    }


    const setNames = ( 
        p1Name = "Player One",
        p2Name = "Player Two")  => {
            players[0].name = p1Name;
            players[1].name = p2Name;
        }

    const restartGame = () => {
        activePlayer = players[0];
        matchResult = 'in-progress';
        board.clearBoard();
        printNewRound();
    }


    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
    }
    //for first round
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getMatchResult,
        getBoard: board.getBoard,
        restartGame,
        setNames,
    }
}

function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');
    const restartButton = document.querySelector('.restart');
    const startButton = document.querySelector('.start');
   

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
                cellButton.dataset.value = cell.getValue();
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
        game.setNames(...getNames());
        updateScreen();
    }

    function clickHandlerStart() {
        game.setNames(...getNames());
        updateScreen();
    }
    const getNames = () => [
            document.querySelector('.p1Name').value,
            document.querySelector('.p2Name').value
        ]

    boardDiv.addEventListener('click', clickHandlerBoard);
    restartButton.addEventListener('click', clickHandlerRestart);
    startButton.addEventListener('click', clickHandlerStart);
  

}

ScreenController();

//check/display ties/wins
//restart game
//computer's turn