const TOTAL_POINTS = 512;
const MIN_STATE = 1;
const MAX_STATE = 51;
const MIN_REGION = 31;
const MAX_REGION = 102;
const NUM_OF_TURNS = 24;
const SQUARES = 64;

const randomIntFromInterval = (ctx, min, max) => {
  return Math.floor(ctx.random.Number() * (max - min + 1) + min);
}

const randomRowTotal = (ctx) => {
  let rowTotals = [];
  rowTotals[7] = 0;

  while (rowTotals[7] < MIN_REGION || rowTotals[7] > MAX_REGION) {
    rowTotals = [];
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const r = randomIntFromInterval(ctx, MIN_REGION, MAX_REGION);
      rowTotals[i] = r;
      sum += r;
    }

    rowTotals[7] = TOTAL_POINTS - sum;
  }

  return rowTotals;
}

const randomSquareTotal = (ctx, max) => {
  let squareTotals = [];
  squareTotals[7] = 0;

  while (squareTotals[7] < MIN_STATE || squareTotals[7] > MAX_STATE) {
    squareTotals = [];
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const r = randomIntFromInterval(ctx, MIN_STATE, Math.min(max - 7, MAX_STATE));
      squareTotals[i] = r;
      sum += r;
      if (sum > max)
        break;
    }

    squareTotals[7] = max - sum;
  }

  return squareTotals;
}

export const setupGridValues = (ctx) => {
  const values = [];
  const rowTotals = randomRowTotal(ctx);
		for (let i = 0; i < 8; i++) {
			const squareTotals = randomSquareTotal(ctx, rowTotals[i]);
			for (let j = 0; j < 8; j++) {
				values[8 * i + j] = squareTotals[j];
			}
		}
  return values;
}

export const otherPlayer = currentPlayer => ((parseInt(currentPlayer, 10) + 1) % 2).toString();

export const getBoxIndecies = (i) => {
  const boxIndecies = [i-9, i-8, i-7, i-1, i+1, i+7, i+8, i+9];
  if (i % 8 === 0) { 
    // Remove left column       
    let j = boxIndecies.indexOf(i-9);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i-1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+7);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  if (i % 8 === 7) { 
    // Remove right column       
    let j = boxIndecies.indexOf(i-7);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+1);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+9);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  if (Math.floor(i / 8) === 0) {
    // Remove top row       
    let j = boxIndecies.indexOf(i-9);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i-8);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i-7);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  if (Math.floor(i / 8) === 7) {
    // Remove bottom row       
    let j = boxIndecies.indexOf(i+9);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+8);
    if (j > -1) boxIndecies.splice(j, 1);
    j = boxIndecies.indexOf(i+7);
    if (j > -1) boxIndecies.splice(j, 1);
  }
  return boxIndecies;
}

const changeScore = (G, ctx, i, num) => {
  const currentMargin = Math.abs(G.gridScores[i][ctx.currentPlayer] - G.gridScores[i][otherPlayer(ctx.currentPlayer)]);
  if (currentMargin >= 9)
    return;
  
  G.gridScores[i][ctx.currentPlayer] += num;
}

const rowClick = (G, ctx, i) => {
  const row = Math.floor(i / 8);
  const rowIndecies = [];
  for (let j = 0; j < 8; j++) {
    const index = 8 * row + j;
    rowIndecies.push(index);
  }

  for (let j = 0; j < SQUARES; j++) {
    if (j === i) {
      changeScore(G, ctx, i, 3);
      continue;
    }

    changeScore(G, ctx, j, rowIndecies.indexOf(j) !== -1 ? 1 : -1);
  }
}

const columnClick = (G, ctx, i) => {
  const col = i % 8;
  const colIndecies = [];
  for (let j = 0; j < 8; j++) {
    const index = j * 8 + col;
    colIndecies.push(index);
  }

  for (let j = 0; j < SQUARES; j++) {
    if (j === i) {
      changeScore(G, ctx, i, 3);
      continue;
    }

    changeScore(G, ctx, j, colIndecies.indexOf(j) !== -1 ? 1 : -1);
  }  
}

const validNum = (num) => {
  return num >= 0 && num < 64;
}
const boxClick = (G, ctx, i) => { 
  const boxIndecies = getBoxIndecies(i);
  boxIndecies.push(i);

  for (let j = 0; j < SQUARES; j++) {
    if (j === i) {
      changeScore(G, ctx, i, 2);
      continue;
    }
    if (validNum(j))
      changeScore(G, ctx, j, boxIndecies.indexOf(j) !== -1 ? 1 : -1);
  } 
}


const winningPlayer = (array) => array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

export const isLockedSquare = (score) => {
  return (Math.abs(score[1] - score[0]) >= 9);
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
  if (ctx.turn >= NUM_OF_TURNS * 2 && ((G.scores[0] > TOTAL_POINTS / 2) ||  (G.scores[1] > TOTAL_POINTS / 2)))
    ctx.events.endGame(getEndGameMessage(G));
  if (ctx.turn >= NUM_OF_TURNS * 2 && G.lockedScores[0] === 256 && G.lockedScores[1] === 256 )
    ctx.events.endGame({ draw: true, message: "Draw", score: 0.5 });

  if (!ctx.gameover)
    G.history.push({name: `${G.history.length + 1}`, red: G.scores[0], blue: G.scores[1]})
}

export const Take257 = {
  setup: (ctx) => ({
    scores: Array(ctx.numPlayers).fill(0),
    lockedScores: Array(ctx.numPlayers).fill(0),
    states: Array(ctx.numPlayers).fill(0),
    selectedCell: undefined,
    lastSelected: undefined,
    gridValues: setupGridValues(ctx),
    gridScores: Array(64).fill(Array(ctx.numPlayers).fill(0)),
    history: []
  }),

  moves: {
    clickCell,
  },

  turn: {
    moveLimit: 1,
    order: {
      first: (G, ctx) => (parseInt(ctx.turn/ctx.numPlayers, 10) % ctx.numPlayers),
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
      for (let i = 0; i < 64; i++) {
        if (G.selectedCell === i || isLockedSquare(G.gridScores[i])) continue;
        moves.push({ move: 'clickCell', args: [i] });
      }
      return moves;
    }
  },
};