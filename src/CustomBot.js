import { MCTSBot } from 'boardgame.io/ai';

class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 1000;
    ai.playoutDepth = 5;
    ai.objectives = (G) => ({
      'better than player 1': {
        checker: (G, ctx) => {
          return ((ctx.turn % ctx.numPlayers === 1) && G.scores[1] > G.scores[0]);
        },
        weight: (function weight(G){return (G.scores[1] - G.scores[0]);}(G)),
      },
    });
    super(ai);
  }

  backpropagate(node) {
    // eslint-disable-next-line prefer-rest-params
    const result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    node.visits++;

    if (result.score !== undefined) {
      node.value += result.score;
    }

    if (result.draw === true) {
      node.value += 500;
    }

    if (node.parentAction && result.winner === "1") {
      node.value += 1000;
    }

    if (node.parent) {
      this.backpropagate(node.parent, result);
    }
  }
}

export default CustomBot;