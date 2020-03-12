import React from 'react';
import Square from './Square';
import { SIZE } from './Take257';

class Board extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hoveredCell: undefined
    };

    this.changeHoveredCell = this.changeHoveredCell.bind(this);
  }
  
  changeHoveredCell = (i) => {
    this.setState({hoveredCell: i})
  }
  
	renderSquare(i) {
    const { G, moves, ctx, setInfoText, playerId } = this.props;
    const { hoveredCell } = this.state;

		return (
			<Square
        id={i}
        key={i}
        value={G.gridValues[i]}
        score={G.gridScores[i]}
        selectedCell={G.selectedCell}
        lastSelected={G.lastSelected}
        hoveredCell={hoveredCell}
        moves={moves}
        ctx={ctx}
        onHover={this.changeHoveredCell}
        setInfoText={setInfoText}
        playerId={playerId}
			/>
		);
  }

	render() {
    const rows = [];
    for (let i = 0; i < SIZE; i++) {
      const squares = [];
      for (let j = 0; j < SIZE; j++)
        squares.push(this.renderSquare((SIZE * i) + j))
      rows.push(<div className="board-row" key={`board${i}`}>{squares}</div>);
    }
		return (
			<div style={{ maxWidth: '500px'}}>
				{rows}
			</div>
		);
	}
}

export default Board;