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

const RED_CODES = [
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

const BLUE_CODES = [
	'#EAFFFF',
	'#D1FFFF',
	'#B7FEFF',
	'#9EE5FF',
	'#84CBFF',
	'#6BB2EF',
	'#387FBC',
	'#1F66A3',
	'#054C89',
  'blue',
];

export class Square extends React.Component {
	setTextColor() {
		if (this.props.squareColor === 'red' || this.props.squareColor === 'blue')
			return 'white';
		else
			return 'black';
  }
  
  setBackgroundColor() {   
    if (this.props.score[0] === this.props.score[1])
      return 'white';
    const indexOfMaxValue = this.props.score.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    if (indexOfMaxValue === 0)
      return RED_CODES[this.props.score[0] - this.props.score[1]];
    else
      return BLUE_CODES[this.props.score[1] - this.props.score[0]];
  }

  onClick = () => {
    this.props.moves.clickCell(this.props.id);
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
				<button key={this.props.id} className="square" onClick={this.onClick} style={{ backgroundColor: this.setBackgroundColor(), color: this.setTextColor() }}>
					{this.props.value}
				</button>
		)
	}
}