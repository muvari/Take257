import React from 'react';
import { Board } from './Board';

export class Take257Board extends React.Component {
	render() {
		return (
			<div className="game">
        <Board G={this.props.G} />
      </div>
		);
	}
}