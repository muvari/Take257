import React from 'react';
import { getBoxIndecies, SIZE } from './Take257';

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

const BIG_HOVER_CLASS = ["red-big-hover", "blue-big-hover"];

const HOVER_CLASS = ["red-hover", "blue-hover"];

class Square extends React.Component {
  
	setTextColor = () => (this.isLockedSquare() ? 'white' : 'black');

  getWinningPlayer = () => {
    if (this.props.score[0] === this.props.score[1])
      return undefined;
    return this.props.score.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
  }

  getWinningLabel = (index) => {
    if (index === undefined)
      return "Draw";
    return TEAM_LABELS[index];
  }

  getNetScore = () => {
    if (this.props.score[0] === this.props.score[1])
      return '';
    if (this.getWinningPlayer() === 0)
      return Math.min(this.props.score[0] - this.props.score[1], 9);
    return Math.min(this.props.score[1] - this.props.score[0], 9);
  }
  
  getShadowClass = () => {
    if (this.isSelectable() && this.props.hoveredCell === this.props.id)
      return BIG_HOVER_CLASS[this.props.playerId];
    if (this.props.selectedCell === this.props.id)
      return BIG_HOVER_CLASS[this.props.lastSelected];

    if (!this.isSelectable()) return;
    if (this.props.ctx.phase === "row" && Math.floor(this.props.hoveredCell / SIZE) === Math.floor(this.props.id / SIZE))
      return HOVER_CLASS[this.props.playerId];
    if (this.props.ctx.phase === "column" && this.props.hoveredCell % SIZE === this.props.id % SIZE)
      return HOVER_CLASS[this.props.playerId];
    if (this.props.ctx.phase === "box") {
      const i = this.props.hoveredCell;
      const boxIndecies = getBoxIndecies(i);
      if (boxIndecies.indexOf(this.props.id) > -1)
        return HOVER_CLASS[this.props.playerId];
    }
  }
  
  setBackgroundColor = () => {   
    if (this.props.score[0] === this.props.score[1])
      return 'white';
    if (this.getWinningPlayer() === 0)
      return RED_CODES[this.getNetScore()];
    return BLUE_CODES[this.getNetScore()];
  }

  onClick = () => {
    if (this.isSelectable()) {
      window.navigator.vibrate(40);
      this.props.moves.clickCell(this.props.id);
      this.props.onHover(undefined);
    }
  }
  
  squareLabel = () => ({ 
            square: this.props.id,
            leader: this.getWinningLabel(this.getWinningPlayer()),
            net: this.getNetScore(),
            isLocked: this.isLockedSquare(),
            red: this.props.score[0],
            blue: this.props.score[1]
            });
  
  isSelectable = () => (!this.isLockedSquare() && this.props.selectedCell !== this.props.id);
  
  isLockedSquare = () => (Math.abs(this.props.score[1] - this.props.score[0]) >= 9);

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