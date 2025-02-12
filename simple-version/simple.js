// Keeps state of the board
function Gameboard() {
	const board = [
		[Cell(), Cell(), Cell()],
		[Cell(), Cell(), Cell()],
		[Cell(), Cell(), Cell()]
	];

	const getBoard = () => board;

	const markCell = (row, column, playerToken) => {
		if (board[row][column].getValue() === 0) {
			board[row][column].placeToken(playerToken);
		}
		else return; // add logic to repeat move if previous attempt is invalid
	};

	const printBoard = () => {
		const filledBoard = board.map((row) => row.map((cell) => cell.getValue()))
		console.log(filledBoard);
	};

	return { getBoard, markCell, printBoard };
}

// Represents each square of the playing board
function Cell() {
	let value = 0;

	const placeToken = (player) => {
		value = player;
	};

	const getValue = () => value;

	return { placeToken, getValue };
}

// Controlls flow and state of the game, turns and winners
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
		console.log(`${getActivePlayer().name}'s turn.`)
	};

	const checkWinner = (board) => {
		const size = board.length;

		for (let i = 0; i < size; i++) {
			if (board[i][0].getValue() !== 0 && board[i].every(cell => cell.getValue() === board[i][0].getValue())) {
				return board[i][0].getValue();
			}
			if (board[0][i].getValue() !== 0 && board.every(row => row[i].getValue() === board[0][i].getValue())) {
				return board[0][i].getValue();
			}
		}

		if (board[0][0].getValue() !== 0 && board.every((row, i) => row[i].getValue() === board[0][0].getValue())) {
			return board[0][0].getValue();
		}

		if (board[0][size - 1].getValue() !== 0 && board.every((row, i) => row[size - 1 - i].getValue() === board[0][size - 1].getValue())) {
			return board[0][size - 1].getValue();
		}

		return null;
	};

	const playRound = (row, column) => {
		if (gameOver) return;

		board.markCell(row, column, getActivePlayer().token);

		let winner = checkWinner(board.getBoard());
		if (winner !== null) {
			(console.log(`Player ${winner} is the winner`));
			gameOver = true;
			return;
		}

		switchPlayerTurn();
		printNewRound();
	};

	printNewRound();

	return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector('.turn');
	const boardDiv = document.querySelector('.game-board');
	const cells = document.querySelectorAll('.cell');

	const updateScreen = () => {
		cells.forEach(cell => cell.textContent = "");

		const activePlayer = game.getActivePlayer();
		playerTurnDiv.textContent = `${activePlayer.name}'s turn`;

	}
	updateScreen();
}

ScreenController();