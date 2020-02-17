import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'

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

const TEAM_LABELS = ["Red", "Blue"];

export class Square extends React.Component {
  

	setTextColor() {
		if (this.isLockedSquare())
			return 'white';
		else
			return 'black';
  }

  getWinningPlayer() {
    if (this.props.score[0] === this.props.score[1])
      return undefined;
    return this.props.score.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
  }

  getWinningLabel(index) {
    if (index === undefined)
      return "Draw";
    return TEAM_LABELS[index];
  }

  getNetScore() {
    if (this.props.score[0] === this.props.score[1])
      return '';
    if (this.getWinningPlayer() === 0)
      return Math.min(this.props.score[0] - this.props.score[1], 9);
    else
      return Math.min(this.props.score[1] - this.props.score[0], 9);
  }

  isLockedSquare() {
    return (Math.abs(this.props.score[1] - this.props.score[0]) >= 9);
  }

  isSelectable() {
    return !this.isLockedSquare() && this.props.selectedCell !== this.props.id;
  }
  
  setBackgroundColor() {   
    if (this.props.score[0] === this.props.score[1])
      return 'white';
    if (this.getWinningPlayer() === 0)
      return RED_CODES[this.getNetScore()];
    else
      return BLUE_CODES[this.getNetScore()];
  }

  getPopover() {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{`${this.getWinningLabel(this.getWinningPlayer())} ${this.getNetScore()} ${this.isLockedSquare() ? "*" : ""}`}</Popover.Title>
        <Popover.Content>
          {`Red: ${this.props.score[0]}`}<br/> {`Blue: ${this.props.score[1]}`}
        </Popover.Content>
      </Popover>
    );
  }

  onClick = () => {
    if (this.isSelectable())
      this.props.moves.clickCell(this.props.id);
  }

  getShadowClass = () => {
    if (this.isSelectable() && this.props.hoveredCell === this.props.id)
      return this.props.ctx.playOrderPos === 0 ? "red-big-hover" : "blue-big-hover";
    else if (this.props.selectedCell === this.props.id)
      return this.props.ctx.playOrderPos === 0 ? "blue-big-hover" : "red-big-hover";
  }

	render() {
		return (
      <OverlayTrigger trigger="hover" placement="top" overlay={this.getPopover()}>
          <button key={this.props.id} 
            className={`square ${this.getShadowClass()}`}
            onClick={this.onClick}
            onMouseEnter={() => {this.props.onHover(this.props.id); }}
            style={{ backgroundColor: this.setBackgroundColor(), color: this.setTextColor(), cursor: `${this.isSelectable() ? "pointer" : "initial"}` }}>
            {this.props.value}
          </button>
      </OverlayTrigger>
		)
	}
}