import React from 'react';
import { Square } from './Square';

export class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
        id={i}
        value={this.props.G.gridValues[i]}
			/>
		);
	}

	render() {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      const squares = [];
      for (let j = 0; j < 8; j++)
        squares.push(this.renderSquare((8 * i) + j))
      rows.push(<div className="board-row">{squares}</div>);
    }
		return (
			<div>
				{rows}
			</div>
		);
	}
}