const TOTAL_POINTS = 512;
const MIN_STATE = 1;
const MAX_STATE = 51;
const MIN_REGION = 31;
const MAX_REGION = 102;
const NUM_OF_TURNS = 36;

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
    console.log(rowTotals);
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

export const Take257 = {
  setup: (ctx) => ({
    scores: [0, 0],
    lockedScores: [0, 0],
    gridValues: setupGridValues(ctx),
  }),

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] === null) {
        G.cells[id] = ctx.currentPlayer;
      }
    },
  },

  endIf: (G, ctx) => {
    if (ctx.turn >= NUM_OF_TURNS && G.scores.some((score) => score >= TOTAL_POINTS / 2)) {
      return { winner: ctx.currentPlayer };
    }
  },
};