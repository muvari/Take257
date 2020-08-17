export const TOTAL_POINTS = 512;
export const HALF_POINTS = TOTAL_POINTS / 2;
export const MIN_STATE = 3;
export const MAX_STATE = 55;
export const MIN_REGION = 31;
export const MAX_REGION = 102;
export const NUM_OF_TURNS = 27;
export const SIZE = 7;
export const SQUARES = SIZE * SIZE;
export const ZERO_INDEX_SIZE = SIZE - 1;
export const MAX_MARGIN = 7;

const randomIntFromInterval = (ctx, min, max) => {
  return Math.floor(ctx.random.Number() * (max - min + 1) + min);
}

const randomRowTotal = (ctx) => {
  let rowTotals = [];
  rowTotals[ZERO_INDEX_SIZE] = 0;

  while (rowTotals[ZERO_INDEX_SIZE] < MIN_REGION || rowTotals[ZERO_INDEX_SIZE] > MAX_REGION) {
    rowTotals = [];
    let sum = 0;
    for (let i = 0; i < ZERO_INDEX_SIZE; i++) {
      const r = randomIntFromInterval(ctx, MIN_REGION, MAX_REGION);
      rowTotals[i] = r;
      sum += r;
    }

    rowTotals[ZERO_INDEX_SIZE] = TOTAL_POINTS - sum;
  }

  return rowTotals;
}

const randomSquareTotal = (ctx, max) => {
  let squareTotals = [];
  squareTotals[ZERO_INDEX_SIZE] = 0;

  while (squareTotals[ZERO_INDEX_SIZE] < MIN_STATE || squareTotals[ZERO_INDEX_SIZE] > MAX_STATE) {
    squareTotals = [];
    let sum = 0;
    for (let i = 0; i < ZERO_INDEX_SIZE; i++) {
      const r = randomIntFromInterval(ctx, MIN_STATE, Math.min(max - ZERO_INDEX_SIZE, MAX_STATE));
      squareTotals[i] = r;
      sum += r;
      if (sum > max)
        break;
    }

    squareTotals[ZERO_INDEX_SIZE] = max - sum;
  }

  return squareTotals;
}

export const setupGridValues = (ctx) => {
  const values = [];
  const rowTotals = randomRowTotal(ctx);
		for (let i = 0; i < SIZE; i++) {
			const squareTotals = randomSquareTotal(ctx, rowTotals[i]);
			for (let j = 0; j < SIZE; j++) {
				values[SIZE * i + j] = squareTotals[j];
			}
		}
  return values;
}

export const otherPlayer = currentPlayer => ((parseInt(currentPlayer, 10) + 1) % 2).toString();

export const getBoxIndecies = (i) => {
  const boxIndecies = [i-SIZE-1, i-SIZE, i-SIZE+1, i-1, i+1, i+SIZE-1, i+SIZE, i+SIZE+1];
  if (i % SIZE === 0) { 
    // Remove left column       
    let j = boxIndecies.indexOf(i-SIZE-1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i-1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+SIZE-1);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  if (i % SIZE === ZERO_INDEX_SIZE) { 
    // Remove right column       
    let j = boxIndecies.indexOf(i-SIZE+1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+SIZE+1);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  if (Math.floor(i / SIZE) === 0) {
    // Remove top row       
    let j = boxIndecies.indexOf(i-SIZE-1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i-SIZE);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i-SIZE+1);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  if (Math.floor(i / SIZE) === ZERO_INDEX_SIZE) {
    // Remove bottom row       
    let j = boxIndecies.indexOf(i+SIZE+1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+SIZE);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+SIZE-1);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  return boxIndecies;
}

export const getOuterBoxIndecies = (i) => {
  const boxIndecies = [i-(SIZE*2)-2, i-(SIZE*2)-1, i-(SIZE*2), i-(SIZE*2)+1, i-(SIZE*2)+2,
        i-SIZE-2, i-2, i+2, i-SIZE+2, i+SIZE-2, i+SIZE+2,
        i+(SIZE*2)-2, i+(SIZE*2)-1, i+(SIZE*2), i+(SIZE*2)+1, i+(SIZE*2)+2];

    if (i % SIZE === 0 || i % SIZE === 1) { 
      // Remove left column       
      let j = boxIndecies.indexOf(i-(SIZE*2)-2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-SIZE-2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+SIZE-2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+(SIZE*2)-2);
      if (j > -1) boxIndecies.splice(j, 1);

      if (i % SIZE === 0) {
        j = boxIndecies.indexOf(i-(SIZE*2)-1);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+(SIZE*2)-1);
        if (j > -1) boxIndecies.splice(j, 1);
      }
    }
    if (i % SIZE === ZERO_INDEX_SIZE || i % SIZE === ZERO_INDEX_SIZE - 1) { 
      // Remove right column       
      let j = boxIndecies.indexOf(i-(SIZE*2)+2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-SIZE+2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+SIZE+2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+(SIZE*2)+2);
      if (j > -1) boxIndecies.splice(j, 1);

      if (i % SIZE === ZERO_INDEX_SIZE) {
        j = boxIndecies.indexOf(i-(SIZE*2)+1);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+(SIZE*2)+1);
        if (j > -1) boxIndecies.splice(j, 1);
      }
    }
    if (Math.floor(i / SIZE) === 0 || Math.floor(i / SIZE) === 1) {
      // Remove top row
      let j = boxIndecies.indexOf(i-(SIZE*2)-2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-(SIZE*2)-1);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-(SIZE*2));
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-(SIZE*2)+1);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i-(SIZE*2)+2);
      if (j > -1) boxIndecies.splice(j, 1);
    }
    if (Math.floor(i / SIZE) === ZERO_INDEX_SIZE || Math.floor(i / SIZE) === ZERO_INDEX_SIZE - 1) {
      // Remove bottom row       
      let j = boxIndecies.indexOf(i+(SIZE*2)-2);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+(SIZE*2)-1);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+(SIZE*2));
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+(SIZE*2)+1);
      if (j > -1) boxIndecies.splice(j, 1);
      j = boxIndecies.indexOf(i+(SIZE*2)+2);
      if (j > -1) boxIndecies.splice(j, 1);
    }
  return boxIndecies;
};


const changeScore = (G, ctx, i, num) => {
  const currentMargin = Math.abs(G.gridScores[i][ctx.currentPlayer] - G.gridScores[i][otherPlayer(ctx.currentPlayer)]);
  if (currentMargin >= MAX_MARGIN)
    return;
  
  if (num > 0)
    G.gridScores[i][ctx.currentPlayer] += num;
  else
    G.gridScores[i][otherPlayer(ctx.currentPlayer)] -= num;
}

const rowClick = (G, ctx, i) => {
  const row = Math.floor(i / SIZE);
  const rowIndecies = [];
  const outerRowIndecies = [];
  for (let j = 0; j < SIZE; j++) {
    const index = SIZE * row + j;
    rowIndecies.push(index);
  }

  const leftRow = Math.floor((i - SIZE) / SIZE);
  const rightRow = Math.floor((i + SIZE) / SIZE);
  for (let j = 0; j < SIZE; j++) {
    const index = SIZE * leftRow + j;
    outerRowIndecies.push(index);
  }
  for (let j = 0; j < SIZE; j++) {
    const index = SIZE * rightRow + j;
    outerRowIndecies.push(index);
  }

  for (let j = 0; j < SQUARES; j++) {
    if (j === i) {
      changeScore(G, ctx, i, 3);
      continue;
    }

    if (outerRowIndecies.indexOf(j) !== -1) 
      continue;

    changeScore(G, ctx, j, rowIndecies.indexOf(j) !== -1 ? 1 : -1);
  }
}

const columnClick = (G, ctx, i) => {
  const col = i % SIZE;
  const colIndecies = [];
  const outerColIndecies = [];
  for (let j = 0; j < SIZE; j++) {
    const index = j * SIZE + col;
    colIndecies.push(index);
  }

  const topCol = (i - 1) % SIZE;
  const bottomCol = (i + 1) % SIZE;
  for (let j = 0; j < SIZE; j++) {
    const index = j * SIZE + topCol;
    outerColIndecies.push(index);
  }
  for (let j = 0; j < SIZE; j++) {
    const index = j * SIZE + bottomCol;
    outerColIndecies.push(index);
  }

  for (let j = 0; j < SQUARES; j++) {
    if (j === i) {
      changeScore(G, ctx, i, 3);
      continue;
    }

    if (outerColIndecies.indexOf(j) !== -1)
      continue;

    changeScore(G, ctx, j, colIndecies.indexOf(j) !== -1 ? 1 : -1);
  }  
}

const validNum = (num) => {
  return num >= 0 && num < SQUARES;
}
const boxClick = (G, ctx, i) => { 
  const boxIndecies = getBoxIndecies(i);
  boxIndecies.push(i);

  const outerBoxIndecies = getOuterBoxIndecies(i);

  for (let j = 0; j < SQUARES; j++) {
    if (j === i) {
      changeScore(G, ctx, i, 2);
      continue;
    }

    if (outerBoxIndecies.indexOf(j) !== -1)
      continue;

    if (validNum(j))
      changeScore(G, ctx, j, boxIndecies.indexOf(j) !== -1 ? 1 : -1);
  } 
}


const winningPlayer = (array) => array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

export const isLockedSquare = (score) => {
  return (Math.abs(score[1] - score[0]) >= MAX_MARGIN);
}

const getCurrentScores = (G, ctx) => {
  const scores = Array(ctx.numPlayers).fill(0);
  const lockedScores = Array(ctx.numPlayers).fill(0);
  const states = Array(ctx.numPlayers).fill(0);
  for (let i = 0; i < G.gridScores.length; i++) {
    if (G.gridScores[i][0] === G.gridScores[i][1])
      continue;
    const score = G.gridScores[i];
    const winner = winningPlayer(score);
    states[winner] += 1;
    scores[winner] += G.gridValues[i];
    if (isLockedSquare(score))
      lockedScores[winner] += G.gridValues[i];
  }
  G.scores = scores;
  G.states = states;
  G.lockedScores = lockedScores;
}

const clickCell = (G, ctx, i) => {
  if (G.selectedCell === i)
    return;

  if (ctx.phase === "row")
    rowClick(G, ctx, i);
  else if (ctx.phase === "column")
    columnClick(G, ctx, i);
  else if (ctx.phase === "box")
    boxClick(G, ctx, i);  

  G.selectedCell = i;
  G.lastSelected = ctx.playOrderPos;
  getCurrentScores(G, ctx);
}

const getEndGameMessage = (G) => {
  return {
    winner: G.scores[0] > G.scores[1] ? "0" : "1",
    score: G.scores[0] > G.scores[1] ? G.scores[0] - G.scores[1] : G.scores[1] - G.scores[0],
    message: G.scores[0] > G.scores[1] ? "Red Wins!" : "Blue Wins!"
  };
}

const onPhaseEnd = (G, ctx) => {
  if (ctx.turn >= NUM_OF_TURNS * 2 && ((G.scores[0] > HALF_POINTS) ||  (G.scores[1] > HALF_POINTS)))
    ctx.events.endGame(getEndGameMessage(G));

  if (ctx.turn >= NUM_OF_TURNS * 2 && G.lockedScores[0] === HALF_POINTS && G.lockedScores[1] === HALF_POINTS)
    ctx.events.endGame({ draw: true, message: "Draw", score: 0.5 });
  
  if (!ctx.gameover)
    G.history.push({name: `${G.history.length + 1}`, Red: G.scores[0], Blue: G.scores[1], gridScores: G.gridScores})
}

export const Take257 = {
  setup: (ctx) => ({
    scores: Array(ctx.numPlayers).fill(0),
    lockedScores: Array(ctx.numPlayers).fill(0),
    states: Array(ctx.numPlayers).fill(0),
    selectedCell: undefined,
    lastSelected: undefined,
    gridValues: setupGridValues(ctx),
    gridScores: Array(SQUARES).fill(Array(ctx.numPlayers).fill(0)),
    history: []
  }),

  playerView: (G, ctx, playerID) => { 
    if (G && !G.playerID) {
      G.playerID = playerID; 
      G.botID = otherPlayer(playerID);
    }
    return G;
  },

  moves: {
    clickCell,
  },

  turn: {
    moveLimit: 1,
    order: {
      first: () => 1,
      next: (G, ctx) => {
        if ((ctx.turn + 1) % ctx.numPlayers < ctx.numPlayers - 1)
          return (ctx.playOrderPos + 1) % ctx.numPlayers;
      }
    },
  },

  phases: {
    row: {
      moves: { clickCell },
      start: true,
      next: 'column',
      onEnd: onPhaseEnd
    },
  
    column: {
      moves: { clickCell },
      next: 'box',
      onEnd: onPhaseEnd
    },

    box: {
      moves: { clickCell },
      next: 'row',
      onEnd: onPhaseEnd
    },
  },

  ai: {
    enumerate: (G) => {
      const moves = [];
      for (let i = 0; i < SQUARES; i++) {
        if (G.selectedCell === i || isLockedSquare(G.gridScores[i])) continue;
        moves.push({ move: 'clickCell', args: [i] });
      }
      return moves;
    }
  },
};