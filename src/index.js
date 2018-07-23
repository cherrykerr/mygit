import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){  //新的函数小方格
    return(
        <button className = "square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component { //棋盘
  constructor(props) {
      super(props);
      this.state = {
          squares: Array(20).fill(Array(20).fill(null)),
          xIsNext: true,
      };
  }
  renderSquare(x,y) {
      return <Square 
        value={this.state.squares[x][y]}
        onClick={() => this.handleClick(x,y)}
      />;
  }
  renderRows(a){
      let arr = [];
      for(let i = 0 ; i < 20 ; i++){
          arr.push(this.renderSquare(a,i));
      }
      return (
          <div className="board-row">
              {arr}
          </div>
      );
  }
  handleClick(x,y){
      const squares = this.state.squares.slice();
      console.log("x:"+x+" y:"+y);
      squares[x][y] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      });
  }
  render() {
    let templet = [];
    for(let i = 0 ; i < 20 ; i++){
        templet.push(this.renderRows(i));
    }
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    return (
      <div>
        <div className="status">{status}</div>
          {templet}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
