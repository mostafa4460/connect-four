/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let h = 0; h < HEIGHT; h++) {
    board.push([]);
    for (let w = 0; w < WIDTH; w++) {
      board[h].push(null);
    };
  };
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector('#board');

  // create HTML row for the column tops, give it an id of "column-top", and add event listener for delegation
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // create HTML cells for the column tops and give them ids 0 - WIDTH (WIDTH not included)
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  };
  htmlBoard.append(top);

  // create HEIGHT amount of HTML rows and WIDTH amount of cells in each row
  // give each cell an id of row# - column# (0 to 5  - 0 to 6)
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    };
    htmlBoard.append(row);
  };
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = x => {
  let y = null;
  for (let i = board.length - 1; i >= 0; i--) {
    if (!board[i][x]) {
      y = i;
      break;
    };
  };
  return y;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const tableCell = document.getElementById(`${y}-${x}`);
  const circle = document.createElement('div');
  circle.classList.add("piece", `p${currPlayer}`);
  tableCell.append(circle);
};

/** endGame: announce game end */

const endGame = msg => {
  alert(msg);
};

/** handleClick: handle click of column top to play piece */

const handleClick = evt => {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  };

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // update in-memory board spot with a value of the current player (1 or 2)
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkForTie()) endGame('It is a tie!');

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = cells => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  };

  // loop over every cell on the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // combination of 4 consecutive horizontal cells anywhere on the board
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];

      // combination of 4 consecutive vertical cells anywhere on the board
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];

      // combination of 4 consecutive diagonal cells (up-right) anywhere on the board
      const diagUR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // combination of 4 consecutive diagonal cells (up-left) anywhere on the board
      const diagUL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // check if one of these different cell combinations are all legal (actually on the HTML board) and made by the same player.
      // if so, return true
      if (_win(horiz) || _win(vert) || _win(diagUR) || _win(diagUL)) {
        return true;
      };
    };
  };
};

/** checkForTie: check if all cells in board are filled */

const checkForTie = () => {
  return board.every(row => row.every(cell => cell !== null));
};

makeBoard();
makeHtmlBoard();