// Keeps state of the board
function Gameboard() {
	const rows = 3;
	const columns = 3;
	const board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell());
		}
	}

	const getBoard = () => board;

	const markCell = (row, column, playerToken) => {
		if (board[row][column].getValue() === 0) {
			board[row][column].placeToken(playerToken);
		}
		else return;
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
	}

	const playRound = (row, column) => {
		board.markCell(row, column, getActivePlayer().token);

		// place winner check logic here

		switchPlayerTurn();
		printNewRound();
	};

	printNewRound();

	return { playRound };
}

const game = GameController();