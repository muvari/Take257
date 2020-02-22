import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Take257 } from './Take257';
import Take257Board from './Take257Board';
import CustomBot from './CustomBot';

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