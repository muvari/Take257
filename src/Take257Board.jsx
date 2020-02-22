import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { BounceLoader } from 'react-spinners';
import Board from './Board';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

const TOTAL_POINTS = 512;

class Take257Board extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      infoText: { leader: "Draw", square: -1, net: 0, red: 0, blue: 0, isLocked: false }
    }

    this.setInfoText = this.setInfoText.bind(this);
  }

  setInfoText(text) {
    this.setState({ infoText: text });
  }

	render() {
    let status;
		if (this.props.ctx.gameover && this.props.ctx.gameover.winner) {
			status = `Winner: ${  this.props.ctx.gameover.winner}`;
		} else {
			status = `Round: ${  this.props.ctx.playOrderPos === 0 ? "Red" : "Blue"}`;
    }

    const round = Math.floor((this.props.ctx.turn - 1) / this.props.ctx.numPlayers) + 1;
    const turn = (this.props.ctx.turn - 1) % 2 + 1;
    
    let phase;
    if (this.props.ctx.phase === "row")
      phase = <i className="fas fa-arrows-alt-h" />
    else if (this.props.ctx.phase === "column")
      phase = <i className="fas fa-arrows-alt-v" />
    else if (this.props.ctx.phase === "box")
      phase = <i className="fas fa-th" />;

    const { infoText } = this.state;
    const squareTitle = infoText.square === -1 ? "" : `Square ${infoText.square}`;
    const squareInfoText = infoText.square === -1 ? "" : `${infoText.leader} ${infoText.net}${infoText.isLocked ? "*" : ""}`
    const extraInfoText = infoText.square === -1 ? "" : `Red ${infoText.red + (round - 1)} Blue ${infoText.blue + (round - 1)}`
		return (<>    
      <div className="row"><h1 className="info-text">Take 257</h1></div>
			<div className="game row">
        <div className="game-board">
          <div className="score-board">
              <div className="score red">{this.props.G.scores[0]}</div>
              { this.props.isActive || this.props.ctx.gameover ? 
                (<div 
                  className={this.props.ctx.gameover ? 'win-text' : 'score-text'} 
                  style={this.props.ctx.gameover ? {} : { marginTop: "40px" }}>
                  {this.props.ctx.gameover ? this.props.ctx.gameover.winner : `Rd. ${round}-${turn}  - Your turn`}</div>) : (
                <div className="loading score-text">
                  <BounceLoader
                    css={{margin: "0 auto"}}
                    size={40}
                    color="#337ab7"
                    loading={!this.props.isActive}
                  />
                  {`Rd. ${round}-${turn} Blue thinking...`}
              </div>
              )
              }              
              <div className="score blue">{this.props.G.scores[1]}</div>
            </div>
          <ProgressBar max={TOTAL_POINTS} style={{ marginBottom: "8px" }}>
            <ProgressBar max={TOTAL_POINTS} bsPrefix="red" now={this.props.G.scores[0]} key={1} />
            <ProgressBar max={TOTAL_POINTS} bsPrefix="blue" now={this.props.G.scores[1]} key={2} />
					</ProgressBar>
          <Board G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} setInfoText={this.setInfoText} />
          <div className="info-text">
            {squareTitle}
          </div>
          <div className="info-text">
            {squareInfoText}
          </div>
          <div className="info-text-extra">
            {extraInfoText}
          </div>
        </div>
        <div className="game-info col-6">
					<div><h3 style={{ textAlign: 'center' }}>{status}</h3></div>
					<div className="row">
						<div className="square info">{round}</div>
            <div className="slash">/</div>
						<div className="square info">{24}</div>
						<div className="square info">{phase}</div>
					</div>
					<div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}># of Squares</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white' }}>{this.props.G.states[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.states[1]}</div>
					</div>
          <div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}>Locked Points</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white', marginBottom: "8px" }}>{this.props.G.lockedScores[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.lockedScores[1]}</div>
					</div>
          <LineChart width={500} height={250} data={this.props.G.history} margin={{
            top: 5, right: 30, left: 5, bottom: 5,
          }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis ticks={[64, 128, 192, 256, 320]} />
            <Tooltip />
            <Line type="monotone" dataKey="red" stroke="rgba(179,45,41)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="blue" stroke="rgba(5,76,137,1)" />
          </LineChart>
          <div style={{width: "500px", marginLeft: "-8px"}}>
          <span style={{fontWeight: "700"}}>Directions: </span>There are 512 points in the grid. 
          Capture over 256 by holding more visit points per square than the other player. 
          A Square visited gains you 3 visit points (2 for box selection). Squares in the group gain 1 point. 
          All unvisited lose you 1 point. 
          You can lock a square by gaining 9 visit points over the other player.
          </div>
				</div>
      </div>
      </>  
		);
	}
}

export default Take257Board;