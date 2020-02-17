import React from 'react';
import { Client } from 'boardgame.io/react';
import { Take257, otherPlayer} from './Take257';
import { Take257Board } from './Take257Board';
import { Local } from 'boardgame.io/multiplayer';
import { MCTSBot } from 'boardgame.io/ai';

class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 1500;
    ai.playoutDepth = 1;
    ai.objectives = () => ({
      '0': {
        checker: (G, ctx) => { 
          const condition = (G.scores[1] > 256);
          if (condition)
            console.log(`${ctx.turn} ${ctx.currentPlayer} ${G.scores[ctx.currentPlayer] - G.scores[otherPlayer(ctx.currentPlayer)]}`);
          return condition;
        },
        weight: 100,
      },
    });
    super(ai);
  }
}

const Take257Client = Client({ 
  game: Take257, 
  board: Take257Board, 
  debug: true, 
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