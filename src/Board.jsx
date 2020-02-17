import React from 'react';
import { Square } from './Square';

export class Board extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hoveredCell: undefined
    };

    this.changeHoveredCell = this.changeHoveredCell.bind(this);
  }

	renderSquare(i) {
		return (
			<Square
        id={i}
        key={i}
        value={this.props.G.gridValues[i]}
        score={this.props.G.gridScores[i]}
        selectedCell={this.props.G.selectedCell}
        lastSelected={this.props.G.lastSelected}
        hoveredCell={this.state.hoveredCell}
        moves={this.props.moves}
        ctx={this.props.ctx}
        onHover={this.changeHoveredCell}
			/>
		);
  }
  
  changeHoveredCell = (i) => {
    this.setState({hoveredCell: i})
  }

	render() {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      const squares = [];
      for (let j = 0; j < 8; j++)
        squares.push(this.renderSquare((8 * i) + j))
      rows.push(<div className="board-row" key={`board${i}`}>{squares}</div>);
    }
		return (
			<div>
				{rows}
			</div>
		);
	}
}