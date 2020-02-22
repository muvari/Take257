import React from 'react';
import { getBoxIndecies } from './Take257';

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

class Square extends React.Component {
  
	setTextColor() {
		if (this.isLockedSquare())
			return 'white';
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
    return Math.min(this.props.score[1] - this.props.score[0], 9);
  }
  
  getShadowClass = () => {
    if (this.isSelectable() && this.props.hoveredCell === this.props.id)
      return "red-big-hover";
    if (this.props.selectedCell === this.props.id)
      return this.props.lastSelected === 1 ? "blue-big-hover" : "red-big-hover";

    if (!this.isSelectable()) return;
    if (this.props.ctx.phase === "row" && Math.floor(this.props.hoveredCell / 8) === Math.floor(this.props.id / 8))
      return "red-hover";
    if (this.props.ctx.phase === "column" && this.props.hoveredCell % 8 === this.props.id % 8)
      return "red-hover";
    if (this.props.ctx.phase === "box") {
      const i = this.props.hoveredCell;
      const boxIndecies = getBoxIndecies(i);
      if (boxIndecies.indexOf(this.props.id) > -1)
        return "red-hover";
    }
  }
  
  setBackgroundColor() {   
    if (this.props.score[0] === this.props.score[1])
      return 'white';
    if (this.getWinningPlayer() === 0)
      return RED_CODES[this.getNetScore()];
    return BLUE_CODES[this.getNetScore()];
  }

  onClick = () => {
    if (this.isSelectable()) {
      this.props.moves.clickCell(this.props.id);
      this.props.onHover(undefined);
    }
  }
  
  squareLabel() {
    return { square: this.props.id,
             leader: this.getWinningLabel(this.getWinningPlayer()),
             net: this.getNetScore(),
             isLocked: this.isLockedSquare(),
             red: this.props.score[0],
             blue: this.props.score[1]
            }
  }
  
  isSelectable() {
    return !this.isLockedSquare() && this.props.selectedCell !== this.props.id;
  }

  
  isLockedSquare() {
    return (Math.abs(this.props.score[1] - this.props.score[0]) >= 9);
  }

	render() {
		return (
      <button key={this.props.id} 
        type="button"
        className={`square ${this.getShadowClass()}`}
        onClick={this.onClick}
        onMouseEnter={() => { 
          this.props.onHover(this.props.id); 
          this.props.setInfoText(this.squareLabel());
        }}
        style={{ backgroundColor: this.setBackgroundColor(), color: this.setTextColor(), cursor: `${this.isSelectable() ? "pointer" : "initial"}` }}>
        {this.props.value}
      </button>
		)
	}
}

export default Square;