import { MCTSBot } from 'boardgame.io/ai';

class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 1000;
    ai.playoutDepth = 5;
    ai.objectives = () => ({
      'win condition': {
        checker: (G, ctx) => {
          return ((ctx.turn % ctx.numPlayers === 1) && G.scores[1] > 256)
        },
        weight: 50,
      },
      'better than player 1': {
        checker: (G, ctx) => {
          return ((ctx.turn % ctx.numPlayers === 1) && G.scores[1] > G.scores[0])
        },
        weight: 10,
      },
    });
    super(ai);
  }
}

export default CustomBot;