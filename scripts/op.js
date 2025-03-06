// Keeps state of the board
function Gameboard() {
	const board = [
		[Cell(), Cell(), Cell()],
		[Cell(), Cell(), Cell()],
		[Cell(), Cell(), Cell()]
	];

	const getBoard = () => board;

	const markCell = (row, column, playerToken) => {
		if (board[row][column].getValue() === null || playerToken === null) {
			board[row][column].placeToken(playerToken);
		}
		else return;
	};

	const printBoard = () => {
		const filledBoard = board.map((row) => row.map((cell) => cell.getValue()));
	};

	return { getBoard, markCell, printBoard };
}

// Represents each square of the playing board
function Cell() {
	let value = null;

	const placeToken = (player) => {
		value = player;
	};

	const getValue = () => value;

	return { placeToken, getValue };
}

// Controls flow and state of the game, turns and winners
function GameController(
	playerOneName = "Player X",
	playerTwoName = "Player O"
) {
	const board = Gameboard();

	const players = [
		{
			name: playerOneName,
			token: 1,
			movesLog: []
		},
		{
			name: playerTwoName,
			token: 2,
			movesLog: []
		}
	];

	let activePlayer = players[0];
	let gameOver = false;

	const switchPlayerTurn = () => {
		if (activePlayer === players[0]) {
			activePlayer = players[1];
		} else {
			activePlayer = players[0];
		}
	};

	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
	};

	const getPlayerFirstLoggedMove = () => getActivePlayer().movesLog[0];
	
	const getMovesCount = () => getActivePlayer().movesLog.length;

	const updatePlaysLog = (row, column) => {
		const playsLog = getActivePlayer().movesLog;

		playsLog.push([row, column]);
		if (playsLog.length > 3) {
			const moveIndex = playsLog.shift();
			console.log("FIRST MOVE LOG:", moveIndex);
			deleteMove(moveIndex[0], moveIndex[1], null);
		}
	};

	const deleteMove = (row, column) =>	board.markCell(row, column, null);

	const checkWinner = (board) => {
		const size = board.length;

		for (let i = 0; i < size; i++) {
			if (board[i][0].getValue() !== null && board[i].every(cell => cell.getValue() === board[i][0].getValue())) {
				return board[i][0].getValue();
			}
			if (board[0][i].getValue() !== null && board.every(row => row[i].getValue() === board[0][i].getValue())) {
				return board[0][i].getValue();
			}
		}

		if (board[0][0].getValue() !== null && board.every((row, i) => row[i].getValue() === board[0][0].getValue())) {
			return board[0][0].getValue();
		}

		if (board[0][size - 1].getValue() !== null && board.every((row, i) => row[size - 1 - i].getValue() === board[0][size - 1].getValue())) {
			return board[0][size - 1].getValue();
		}

		return null;
	};

	const isBoardFull = () => board.getBoard().every(row => row.every(cell => cell.getValue() !== null));

	const playRound = (row, column) => {
		if (gameOver) return;

		board.markCell(row, column, getActivePlayer().token);
		updatePlaysLog(row, column);
		console.log(getActivePlayer().movesLog);

		let winner = checkWinner(board.getBoard());
		if (winner !== null) {
			gameOver = true;
			return;
		}
		if (isBoardFull()) {
			gameOver = true;
			return;
		}

		switchPlayerTurn();
		printNewRound();
	};

	const resetGame = () => {
		board.getBoard().forEach(row => row.forEach(cell => cell.placeToken(null)));
		activePlayer = players[0];
		gameOver = false;
		players[0].movesLog = [];
		players[1].movesLog = [];
		console.clear();
	};

	printNewRound();

	return {
		playRound,
		getActivePlayer,
		getPlayerFirstLoggedMove,
		getMovesCount,
		getBoard: board.getBoard,
		checkWinner,
		isBoardFull,
		resetGame
	};
}

function ScreenController() {
	const game = GameController();
	const boardDiv = document.querySelector('.game-board');
	const statusDiv = document.querySelector('.status');
	const restartButton = document.querySelector('.restart-button');

	const createBoard = () => {
		boardDiv.innerHTML = "";
		const board = game.getBoard();

		board.forEach((row, rowIndex) => {
			row.forEach((cellObj, colIndex) => {
				const button = document.createElement("button");
				const span = document.createElement("span");
				span.textContent = cellObj.getValue();
				button.classList.add("cell");

				button.dataset.row = rowIndex;
				button.dataset.col = colIndex;

				button.addEventListener("click", handleCellClick);

				button.appendChild(span);
				boardDiv.appendChild(button);
			});
		});
	};

	const updateScreen = () => {
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		statusDiv.textContent = `${activePlayer.name}'s turn`;

		const tokenSymbols = {
			1: "X",
			2: "O"
		};

		const playerColors = {
			1: "player1",
			2: "player2"
		}

		document.querySelectorAll(".cell").forEach(button => {
			const row = parseInt(button.dataset.row);
			const col = parseInt(button.dataset.col);
			const span = button.querySelector("span");
			const cellValue = board[row][col].getValue();

			const winner = game.checkWinner(board);
			const movesCount = game.getMovesCount();
			const firstMove = game.getPlayerFirstLoggedMove();
			span.classList.remove("faded");
			if (winner === null && movesCount === 3 && firstMove !== undefined && row === firstMove[0] && col === firstMove[1]) {
				span.classList.add("faded");
			}

			button.classList.remove("player1", "player2");
			
			if (cellValue !== null) {
				button.classList.add(playerColors[cellValue]);
				span.textContent = tokenSymbols[cellValue];
			} else {
				span.textContent = "";
			}
		});
	};

	const handleCellClick = (event) => {
		const row = parseInt(event.target.dataset.row);
		const col = parseInt(event.target.dataset.col);
		const board = game.getBoard();

		if (board[row][col].getValue() !== null) return;
		
		game.playRound(row, col);

		updateScreen();

		const winner = game.checkWinner(board);
		if (winner) {
			statusDiv.textContent = `${game.getActivePlayer().name} won!`;
			statusDiv.classList.add("winner-announcement");
			return;
		}
		if (game.isBoardFull()) {
			statusDiv.textContent = `It's a draw!`;
			return;
		}
	};

	const handleRestart = () => {
		game.resetGame();
		statusDiv.classList.remove("winner-announcement");
		updateScreen();
	};

	restartButton.addEventListener("click", handleRestart);

	createBoard();
	updateScreen();
}

ScreenController();