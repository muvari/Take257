import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { MCTSBot } from 'boardgame.io/ai';
import { Take257 } from './Take257';
import Take257Board from './Take257Board';

class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 1000;
    ai.playoutDepth = (G, ctx) => (ctx.turn <= 44 ? 4 : 2);
    ai.objectives = () => ({
      '0': {
        checker: (G, ctx) => {
          return ((ctx.turn % ctx.numPlayers === 1) && G.scores[1] > G.scores[0])
        },
        weight: 1,
      },
    });
    super(ai);
  }
}

const Take257Client = Client({ 
  game: Take257, 
  board: Take257Board, 
  debug: false, 
  numPlayers: 2,
  multiplayer: Local({
    bots: {
      '1': CustomBot 
    },
  }), 
});

const App = () => (
    <Take257Client playerID="0" />
);

export default App;