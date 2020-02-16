import React from 'react';
import { Board } from './Board';
import { ProgressBar } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
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

    const chartData = {
      labels: Array.from(Array(this.props.G.history[0].length).keys()),
			datasets: [{
        key: 'red',
				label: 'Red',
				borderColor: 'rgba(179,45,41,1)',				
				data: this.props.G.history[0],
				type: 'line',
        fill: false,
        },
        {
        key: 'blue',
				label: 'Blue',
				data: this.props.G.history[1],
				borderColor: 'rgba(5,76,137,1)',
				type: 'line',
        fill: false,
			  }]
		};
		var chartOptions = {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0,
						suggestedMax: 300,
						stepSize: 64
					}
				}]
			},
			legend: false
    };
    
    let phase;
    if (this.props.ctx.phase === "row")
      phase = <i class="fas fa-arrows-alt-h"></i>
    else if (this.props.ctx.phase === "column")
      phase = <i class="fas fa-arrows-alt-v"></i>
    else if (this.props.ctx.phase === "box")
      phase = <i class="fas fa-th"></i>;
    
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
						<div className="square info">{parseInt(this.props.ctx.turn / this.props.ctx.numPlayers)}</div>
            <div className="slash">/</div>
						<div className="square info">{36}</div>
						<div className="square info">{phase}</div>
					</div>
					<div className="row">
						<h3 className="col-12" style={{ textAlign: 'center' }}># of Squares</h3>
						<div className="square info" style={{ background: '#c9302c', color: 'white' }}>{this.props.G.states[0]}</div>
						<div className="square info" style={{ background: '#337ab7', color: 'white' }}>{this.props.G.states[1]}</div>
					</div>
					<Line data={chartData} options={chartOptions} width={400} height={250} />
				</div>
      </div>
      </React.Fragment>  
		);
	}
}