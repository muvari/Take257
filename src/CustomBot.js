import { MCTSBot } from 'boardgame.io/ai';
import { HALF_POINTS } from './Take257';

class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 1000;
    ai.playoutDepth = (G, ctx) => (Math.min(6, Math.max(2, 60 - ctx.turn)));
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
    const nodeState = node.state;
    node.visits++;

    if (result.score !== undefined)
      node.value += result.score;
    if (nodeState.G.scores[nodeState.G.botID] > HALF_POINTS)
      node.value += 100;
    if (nodeState.G.scores[nodeState.G.playerID] <= HALF_POINTS)
      node.value += 100;
    if (node.parent)
      this.backpropagate(node.parent, result);
  }
}

export default CustomBot;