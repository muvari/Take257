import React from 'react';

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

  squareLabel() {
    return `Square ${this.props.id}: ${this.getWinningLabel(this.getWinningPlayer())} ${this.getNetScore()}${this.isLockedSquare() ? "*" : ""}`;
  }
  
  setBackgroundColor() {   
    if (this.props.score[0] === this.props.score[1])
      return 'white';
    if (this.getWinningPlayer() === 0)
      return RED_CODES[this.getNetScore()];
    else
      return BLUE_CODES[this.getNetScore()];
  }

  onClick = () => {
    if (this.isSelectable()) {
      this.props.moves.clickCell(this.props.id);
      this.props.onHover(undefined);
    }
  }

  getShadowClass = () => {
    if (this.isSelectable() && this.props.hoveredCell === this.props.id)
      return "red-big-hover";
    else if (this.props.selectedCell === this.props.id)
      return this.props.lastSelected === 1 ? "blue-big-hover" : "red-big-hover";

    if (!this.isSelectable()) return;
    if (this.props.ctx.phase === "row" && Math.floor(this.props.hoveredCell / 8) === Math.floor(this.props.id / 8))
      return "red-hover";
    else if (this.props.ctx.phase === "column" && this.props.hoveredCell % 8 === this.props.id % 8)
      return "red-hover";
    else if (this.props.ctx.phase === "box") {
      const i = this.props.hoveredCell;
      const boxIndecies = [i-9, i-8, i-7, i-1, i+1, i+7, i+8, i+9];
      if (i % 8 === 0) { 
        // Remove left column       
        let j = boxIndecies.indexOf(i-9);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i-1);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+7);
        if (j > -1) boxIndecies.splice(j, 1);
      }
      if (i % 8 === 7) { 
        // Remove right column       
        let j = boxIndecies.indexOf(i-7);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+1);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+9);
        if (j > -1) boxIndecies.splice(j, 1);
      }
      if (Math.floor(i / 8) === 0) {
        // Remove top row       
        let j = boxIndecies.indexOf(i-9);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i-8);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i-7);
        if (j > -1) boxIndecies.splice(j, 1);
      }
      if (Math.floor(i / 8) === 7) {
        // Remove bottom row       
        let j = boxIndecies.indexOf(i+9);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+8);
        if (j > -1) boxIndecies.splice(j, 1);
        j = boxIndecies.indexOf(i+7);
        if (j > -1) boxIndecies.splice(j, 1);
      }


      if (boxIndecies.indexOf(this.props.id) > -1)
        return "red-hover";
    }
  }

	render() {
		return (
      <button key={this.props.id} 
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