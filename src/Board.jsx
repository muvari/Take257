import React from 'react';
import Square from './Square';
import { SIZE } from './Take257';

const colLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

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
  
	renderSquare(i, row, col) {
    const { G, moves, ctx, setInfoText, playerId } = this.props;
    const { hoveredCell } = this.state;

		return (
			<Square
        id={i}
        key={i}
        row={row + 1}
        col={colLetter[col]}
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
    const colLets = [];
    for (let i = 0; i < SIZE; i++) {
      const squares = [];
      colLets.push(<div className="col-num">{colLetter[i]}</div>);
      for (let j = 0; j < SIZE; j++)
        squares.push(this.renderSquare((SIZE * i) + j, i, j))
      rows.push(<div className="board-row" key={`board${i}`}><div className="row-num">{i + 1}</div>{squares}</div>);
    }
		return (
    <>
      <div style={{ display: "flex", maxWidth: '500px', paddingLeft: '18px', justifyContent: 'center'}}>{colLets}</div>
      <div onMouseLeave={() => {this.setState({hoveredCell: undefined});}} style={{ maxWidth: '500px'}}>
        {rows}
      </div>
    </>
		);
	}
}

export default Board;