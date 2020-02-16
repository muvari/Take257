import React from 'react';

const COLOR_CODES = [
	'blue',
	'#054C89',
	'#1F66A3',
	'#387FBC',
	'#6BB2EF',
	'#84CBFF',
	'#9EE5FF',
	'#B7FEFF',
	'#D1FFFF',
	'#EAFFFF',
	'#ffffff',
	'#FFE5E1',
	'#FFCECA',
	'#FFB7B3',
	'#FFA09C',
	'#FF8985',
	'#F8726E',
	'#E15B57',
	'#CA4440',
	'#b32d29',
	'red',
];

// const MID_COLOR = 10;

export class Square extends React.Component {
	setTextColor() {
		if (this.props.squareColor === 'red' || this.props.squareColor === 'blue')
			return 'white';
		else
			return 'black';
	}

	render() {
		// var distance = Math.abs(COLOR_CODES.indexOf(this.props.squareColor) - MID_COLOR);
		// const popoverHoverFocus = (
		// 	<Popover id="popover-trigger-hover-focus" style={{ backgroundColor: this.props.squareColor, color: this.setTextColor() }}>
		// 		<strong>+ {distance}</strong><br />
		// 		<strong>+ {distance}</strong>
		// 	</Popover>
		// );

		return (
				<button className="square" onClick={this.props.onClick} style={{ backgroundColor: this.props.squareColor, color: this.setTextColor() }}>
					{this.props.value}
				</button>
		)
	}
}