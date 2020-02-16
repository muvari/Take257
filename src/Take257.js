const TOTAL_POINTS = 512;
const MIN_STATE = 1;
const MAX_STATE = 51;
const MIN_REGION = 31;
const MAX_REGION = 102;
const NUM_OF_TURNS = 36;
const SQUARES = 64;

const randomRowTotal = (ctx) => {
  let rowTotals = [];
  rowTotals[7] = 0;

  while (rowTotals[7] < MIN_REGION || rowTotals[7] > MAX_REGION) {
    rowTotals = [];
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      let r = randomIntFromInterval(ctx, MIN_REGION, MAX_REGION);
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
      let r = randomIntFromInterval(ctx, MIN_STATE, MAX_STATE);
      squareTotals[i] = r;
      sum += r;
    }

    squareTotals[7] = max - sum;
  }

  return squareTotals;
}


const randomIntFromInterval = (ctx, min, max) => {
  return Math.floor(ctx.random.Number() * (max - min + 1) + min);
}

export const setupGridValues = (ctx) => {
  const values = [];
  const rowTotals = randomRowTotal(ctx);
		for (let i = 0; i < 8; i++) {
			let squareTotals = randomSquareTotal(ctx, rowTotals[i]);
			for (let j = 0; j < 8; j++) {
				values[8 * i + j] = squareTotals[j];
			}
		}
  return values;
}

const otherPlayer = currentPlayer => ((parseInt(currentPlayer, 10) + 1) % 2).toString();

const changeScore = (G, ctx, i, num) => {
  const currentMargin = G.gridScores[i][ctx.currentPlayer] - G.gridScores[i][otherPlayer(ctx.currentPlayer)];
  if (currentMargin + num <= -10 || currentMargin + num >= 10)
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
  const boxIndecies = [];
  boxIndecies.push(i - 9);
  boxIndecies.push(i - 8);
  boxIndecies.push(i - 7);
  boxIndecies.push(i - 1);
  boxIndecies.push(i + 1);
  boxIndecies.push(i + 7);
  boxIndecies.push(i + 8);
  boxIndecies.push(i + 9);
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
  getCurrentScores(G, ctx);
  ctx.events.endTurn();
}


const winningPlayer = (array) => array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

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
  }
  G.scores = scores;
  G.states = states;
  G.lockedScores = lockedScores;
}

const onPhaseEnd = (G, ctx) => {
  G.selectedCell = undefined;
  for (let i = 0; i < G.scores.length; i++) {
    G.history[i].push(G.scores[i]);
  }
}

export const Take257 = {
  setup: (ctx) => ({
    scores: Array(ctx.numPlayers).fill(0),
    lockedScores: Array(ctx.numPlayers).fill(0),
    states: Array(ctx.numPlayers).fill(0),
    selectedCell: undefined,
    gridValues: setupGridValues(ctx),
    gridScores: Array(64).fill(Array(ctx.numPlayers).fill(0)),
    history: Array(ctx.numPlayers).fill([])
  }),

  moves: {
    clickCell,
  },

  turn: {
    order: {
      first: (G, ctx) => (parseInt(ctx.turn/ctx.numPlayers) % ctx.numPlayers),
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

  endIf: (G, ctx) => {
    if (ctx.turn >= NUM_OF_TURNS * 2 && ctx.turn % ctx.numPlayers === 0 && G.scores.some((score) => score >= TOTAL_POINTS / 2)) {
      return { winner: ctx.currentPlayer };
    }
  },
};