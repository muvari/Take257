import { Client } from 'boardgame.io/react';
import { Take257 } from './Take257';
import { Take257Board } from './Take257Board';

const App = Client({ game: Take257, board: Take257Board });

export default App;