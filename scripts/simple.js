// Keeps state of the board
function Gameboard() {
	const board = [
		[Cell(), Cell(), Cell()],
		[Cell(), Cell(), Cell()],
		[Cell(), Cell(), Cell()]
	];

	const getBoard = () => board;

	const markCell = (row, column, playerToken) => {
		if (board[row][column].getValue() === null) {
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
	playerOneName = "Player One",
	playerTwoName = "Player Two"
) {
	const board = Gameboard();

	const players = [
		{
			name: playerOneName,
			token: 1
		},
		{
			name: playerTwoName,
			token: 2
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
	};

	printNewRound();

	return { playRound, getActivePlayer, getBoard: board.getBoard, checkWinner, isBoardFull, resetGame };
}

function ScreenController() {
	const game = GameController();
	const boardDiv = document.querySelector('.game-board');
	const playerTurnDiv = document.querySelector('.status');
	const restartButton = document.querySelector('.restart-button');

	const createBoard = () => {
		boardDiv.innerHTML = "";
		const board = game.getBoard();

		board.forEach((row, rowIndex) => {
			row.forEach((cellObj, colIndex) => {
				const button = document.createElement("button");
				button.classList.add("cell");
				button.textContent = cellObj.getValue();

				button.dataset.row = rowIndex;
				button.dataset.col = colIndex;

				button.addEventListener("click", handleCellClick);

				boardDiv.appendChild(button);
			});
		});
	};

	const updateScreen = () => {
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

		const convertToken = (token) => {
			if (token === 1)
				return "X";
			else if (token === 2)
				return "O";
		};

		document.querySelectorAll(".cell").forEach(button => {
			const row = parseInt(button.dataset.row);
			const col = parseInt(button.dataset.col);
			button.textContent = convertToken(board[row][col].getValue());
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
			playerTurnDiv.textContent = `${game.getActivePlayer().name} won!`;
			return;
		}
		if (game.isBoardFull()) {
			playerTurnDiv.textContent = `It's a draw!`;
			return;
		}
	};

	const handleRestart = () => {
		game.resetGame();
		updateScreen();
	};

	restartButton.addEventListener("click", handleRestart);

	createBoard();
	updateScreen();
}

ScreenController();