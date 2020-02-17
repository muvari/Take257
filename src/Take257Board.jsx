import React from 'react';
import { Board } from './Board';
import { ProgressBar } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

const TOTAL_POINTS = 512;

export class Take257Board extends React.Component {

	render() {
    let status;
		if (this.props.ctx.gameover && this.props.ctx.gameover.winner) {
			status = "Winner: " + this.props.ctx.gameover.winner;
		} else {
			status = "Turn: " + (this.props.ctx.playOrderPos === 0 ? "Red" : "Blue");
    }
    
    let phase;
    if (this.props.ctx.phase === "row")
      phase = <i className="fas fa-arrows-alt-h"></i>
    else if (this.props.ctx.phase === "column")
      phase = <i className="fas fa-arrows-alt-v"></i>
    else if (this.props.ctx.phase === "box")
      phase = <i className="fas fa-th"></i>;
    
		return (<React.Fragment>    
      <div className="row"><h1 style={{ textAlign: 'center' }}>Take 257</h1></div>
			<div className="game row">
        <div className="game-board">
          <div className="score-board">
              <div className="score red">{this.props.G.scores[0]}</div>
              <div className="score blue">{this.props.G.scores[1]}</div>
            </div>
          <ProgressBar max={TOTAL_POINTS} style={{ marginBottom: "8px" }}>
            <ProgressBar max={TOTAL_POINTS} bsPrefix="red" now={this.props.G.scores[0]} key={1} />
            <ProgressBar max={TOTAL_POINTS} bsPrefix="blue" now={this.props.G.scores[1]} key={2} />
					</ProgressBar>
          <Board G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} />
        </div>
        <div className="game-info col-6">
					<div><h3 style={{ textAlign: 'center' }}>{status}</h3></div>
					<div className="row">
						<div className="square info">{parseInt(this.props.ctx.turn / this.props.ctx.numPlayers) + 1}</div>
            <div className="slash">/</div>
						<div className="square info">{36}</div>
						<div className="square info">{phase}</div>
					</div>
					<div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}># of Squares</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white' }}>{this.props.G.states[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.states[1]}</div>
					</div>
          <div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}>Locked Points</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white' }}>{this.props.G.lockedScores[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.lockedScores[1]}</div>
					</div>
          <LineChart width={500} height={250} data={this.props.G.history} margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis ticks={[64, 128, 192, 256, 320]} />
            <Tooltip />
            <Line type="monotone" dataKey="red" stroke="rgba(179,45,41)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="blue" stroke="rgba(5,76,137,1)" />
          </LineChart>
          <div style={{width: "500px"}}>
          <span style={{fontWeight: "700"}}>Directions: </span>There are 512 points in the grid. 
          Your goal is to capture the majority of them by selecting groups of squares over 36 rounds. 
          You can lock a square by getting 9 points above the other player. Any square outside of your selection loses you a point.
          First player rotates every round.
          </div>
				</div>
      </div>
      </React.Fragment>  
		);
	}
}