import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import emitter from './event.js';


/*function Square(props){
    return(
        <button className = "square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}*/


class Square extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      x:this.props.x,
      y:this.props.y
    }
  }
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
class Board extends React.Component { //棋盘
  constructor(props) {
      super(props);
      this.state = {
          squares: Array(20).fill(null).map(()=>Array(20).fill(null)), //包含“X”“O”null的二维数组
          xIsNext: true,
          winner:false,
          champion:undefined
      };
  }
  componentDidMount   (){
        let that = this;
        this.eventEmitter = emitter.addListener("hello",(msg)=>{
            that.setState({
                squares:msg[0],
                xIsNext:msg[1]
            })
        });
    }
    componentWillUnmount(){
        emitter.removeListener(this.eventEmitter);
    }
  renderSquare(x,y) {
      return <Square 
        x={x}
        y={y}
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
      if(squares[x][y] || this.state.winner){
        return;
      }
      squares[x][y] = this.state.xIsNext ? 'X' : 'O';
      let winner = calculateWinner(this.state.squares,x,y);
      if(winner){
        this.setState({winner:true,champion:winner})
      }
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext
      });
      emitter.emit("callMe",this.state);
  }
  render() {
    let templet = [];
    for(let i = 0 ; i < 20 ; i++){
        templet.push(this.renderRows(i));
    }
    let status;
    if (this.state.winner) {
        status = 'Winner: ' + this.state.champion;
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
          <div className="status">
            {status}
          </div>
          {templet}
      </div>
    );
  }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = { 
            history : [Array(20).fill(null).map(()=>Array(20).fill(null))]
        }
    }
    componentDidMount   (){
        let that = this;
        this.eventEmitter = emitter.addListener("callMe",(msg)=>{
            let history1 = that.state.history.slice();
            history1.push(msg.squares.map((i)=>i.slice()));
            that.setState({
                msg : msg,
                history : history1
            })
        });
    }
    componentWillUnmount(){
        emitter.removeListener(this.eventEmitter);
    }
    jumpTo(move){
        this.setState({
            history:this.state.history.slice(0,move+1),
            squares:this.state.history[move]
        })
        let a = (move+1)%2===0?false:true;
        emitter.emit("hello",[this.state.history[move],a]);
    }
    render() {
        console.log(this.state);
        const moves = this.state.history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        return (
        <div className="game">
            <div className="game-board">
                <Board/>
            </div>
            <div className="game-info">
            <div>{/* status */}</div>
            <ol>{moves}</ol>
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

function calculateWinner(squares,x,y) {
  let count = 0;
  let arr = [];
  //第一种向下斜线
  for(let i = 1 ; i < 5 ; i++){
      if(x-i < 0 || y-i < 0){
          break;
      }
      if(squares[x-i][y-i] === squares[x][y]){
          count += 1;
      }else{
          break;
      }
  }
  for(let i = 1 ; i < 5 ; i++){
      if(x+i > 19 || y+i > 19){
          break;
      }
      if(squares[x+i][y+i] === squares[x][y]){
          count += 1;
      }else{
          break;
      }
  }
  if(count === 4){
      return squares[x][y];
  }else{
      count = 0;
  };
  //第二种向上斜线
  for(let i = 1 ; i < 5 ; i++){
      if(y-i < 0 || x+i > 19){
          break;
      }
      if(squares[x+i][y-i] === squares[x][y]){
          count += 1;
      }else{
          break;
      }
  }
  for(let i = 1 ; i < 5 ; i++){
      if(x-i < 0 || y+i > 19){
          break;
      }
      if(squares[x-i][y+i] === squares[x][y]){
          count += 1;
      }else{
          break;
      }
  }
  if(count === 4){
      return squares[x][y];
  }else{
      count = 0;
  };
  //第三种竖线
  for(let i = 1 ; i < 5 ; i++){
      if(x-i >= 0){
          if(squares[x-i][y] === squares[x][y]){
              arr.push(1);
          }else{arr.push(0)}
      }
      if(x+i <= 19){
          if(squares[x+i][y] === squares[x][y]){
              arr.unshift(1);
          }else{arr.unshift(0)}
      }
  }
  for(let a = 0; a< arr.length; a++){
      if(arr[a] === 1){
          count += 1;
      }else{
          count = 0;
      }
      if(count === 4){
          return squares[x][y];
      }
  }
  count = 0;
  arr = [];
  //第四种横线
  for(let i = 1 ; i < 5 ; i++){
      if(y-i >= 0){
          if(squares[x][y-i] === squares[x][y]){
              arr.push(1);
          }else{arr.push(0)}
      }
      if(y+i <= 19){
          if(squares[x][y+i] === squares[x][y]){
              arr.unshift(1);
          }else{arr.unshift(0)}
      }
  }
  for(let a = 0; a< arr.length; a++){
      if(arr[a] === 1){
          count += 1;
      }else{
          count = 0;
      }
      if(count === 4){
          return squares[x][y];
      }
  }
  return null;
}
