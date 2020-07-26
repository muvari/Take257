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
		if (this.props.ctx.gameover && this.props.ctx.gameover.message) {
			status = `Winner: ${  this.props.ctx.gameover.message}`;
		} else {
			status = `Round: ${  this.props.ctx.playOrderPos === 0 ? "Red" : "Blue"}`;
    }

    const round = Math.floor((this.props.ctx.turn - 1) / this.props.ctx.numPlayers) + 1;
    const turn = (this.props.ctx.turn - 1) % 2 + 1;
    
    let phase;
    if (this.props.ctx.gameover)
      phase = <i className="fas fa-flag-checkered" />;
    else if (this.props.ctx.phase === "row")
      phase = <i className="fas fa-arrows-alt-h" />
    else if (this.props.ctx.phase === "column")
      phase = <i className="fas fa-arrows-alt-v" />
    else if (this.props.ctx.phase === "box")
      phase = <i className="fas fa-th" />;

    const { infoText } = this.state;
    const squareTitle = infoText.square === -1 ? "" : `Square ${infoText.square}`;
    const squareInfoText = infoText.square === -1 ? "" : `${infoText.leader} ${infoText.net}${infoText.isLocked ? "*" : ""}`
    const extraInfoText = infoText.square === -1 ? "" : `Red: ${infoText.red} | Blue: ${infoText.blue}`
		return (<>    
    <div className="row"><h1 className="info-text">{`Take ${TOTAL_POINTS / 2 + 1}`}</h1></div>
			<div className="game row">
        <div className="game-board">
          <div className="score-board">
              <div className="score red">{this.props.G.scores[0]}</div>
              { this.props.isActive || this.props.ctx.gameover ? 
                (<div 
                  className={this.props.ctx.gameover ? 'win-text' : 'score-text'} 
                  style={this.props.ctx.gameover ? {} : { marginTop: "40px" }}>
                  {this.props.ctx.gameover ? this.props.ctx.gameover.message : `Round ${round}-${turn}  - Your turn`}</div>) : (
                <div className="loading score-text">
                  <BounceLoader
                    css={{margin: "0 auto"}}
                    size={40}
                    color={this.props.playerID === "0" ? "#337ab7" : "#c9302c"}
                    loading={!this.props.isActive}
                  />
                  {`Round ${round}-${turn} ${this.props.playerID === "0" ? "Blue" : "Red"} thinking...`}
              </div>
              )
              }              
              <div className="score blue">{this.props.G.scores[1]}</div>
            </div>
          <ProgressBar max={TOTAL_POINTS} style={{ marginBottom: "8px" }}>
            <ProgressBar max={TOTAL_POINTS} bsPrefix="red" now={this.props.G.scores[0]} key={1} />
            <ProgressBar max={TOTAL_POINTS} bsPrefix="blue" now={this.props.G.scores[1]} key={2} />
					</ProgressBar>
          <Board G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} setInfoText={this.setInfoText} playerId={this.props.playerID} />
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
						<div className="square info">{phase}</div>
						<div className="square info">{this.props.ctx.gameover ? "F" : round}</div>
            <div className="slash">/</div>
						<div className="square info">{27}</div>
					</div>
					<div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}># of Squares</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white' }}>{this.props.G.states[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.states[1]}</div>
					</div>
          <div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}>Decided Points</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white', marginBottom: "8px" }}>{this.props.G.lockedScores[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.lockedScores[1]}</div>
					</div>
          <LineChart width={Math.min(500, window.screen.width)} height={250} data={this.props.ctx.gameover ? this.props.G.history.filter((_val, index) => index !== this.props.G.history.length - 1) : this.props.G.history} margin={{
            top: 5, right: 30, left: 5, bottom: 5,
          }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis ticks={[64, 128, 192, 256, 320]} />
            <Tooltip />
            <Line type="monotone" dataKey="red" stroke="rgba(179,45,41)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="blue" stroke="rgba(5,76,137,1)" />
          </LineChart>
          <div style={{maxWidth: "500px", marginLeft: "-8px", width: "100vw"}}>
          <span style={{fontWeight: "700"}}>Directions: </span><p>{`There are ${TOTAL_POINTS} points in the grid. 
          Your goal is to capture a majority by visiting each square more than the other player.`}
          </p> 
          <p>{`Clicking a square: +3 visit points (+2 in box selection rounds). 
          Neighboring squares:  +1 point. 
          Unvisited squares: -1 point.`}</p>
          <p>Squares lock at +7.</p>
          <p>Minimum 27 Rounds. Your color is randomized.</p>
          </div>
				</div>
      </div>
      </>  
		);
	}
}

export default Take257Board;