import { MCTSBot } from 'boardgame.io/ai';

class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 1000;
    ai.playoutDepth = (G, ctx) => (Math.min(5, Math.max(1, 60 - ctx.turn)));
    ai.objectives = (G) => ({
      'better than player 1': {
        checker: (G, ctx) => {
          return ((ctx.turn % ctx.numPlayers === 1));
        },
        weight: (function weight(G){return (G.scores[G.botID] - G.scores[G.playerID]);}(G)),
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
    
    if (node.parent) {
      this.backpropagate(node.parent, result);
    }
  }
}

export default CustomBot;