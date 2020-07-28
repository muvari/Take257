import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Take257, otherPlayer } from './Take257';
import Take257Board from './Take257Board';
import CustomBot from './CustomBot';

const ClientOptions = (playerId) => {
  const bots = {};
  bots[otherPlayer(playerId)] = CustomBot;
  return {
    game: Take257, 
    board: Take257Board, 
    debug: false, 
    numPlayers: 2,
    multiplayer: Local({
      bots
    }), 
  }
};

// const Take257Client0 = Client(ClientOptions("0"));
const Take257Client1 = Client(ClientOptions("1"));

const App = () => {
  // const randomPlayerId = Math.round(Math.random());
  // if (randomPlayerId === 0)
  //   return <Take257Client0 playerID="0" />;
  return <Take257Client1 playerID="1" />;
};

export default App;