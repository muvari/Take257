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
      if (result.score > 256)
        node.value += 256;
    }

    if (result.draw === true) {
      node.value += 50;
    }

    // Seems to sabotage itself with this?
    // if (node.parentAction && result.winner === "0") {
    //   node.value += 10000;
    // }

    if (node.parent) {
      this.backpropagate(node.parent, result);
    }
  }
}

export default CustomBot;