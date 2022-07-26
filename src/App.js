import React, { Component } from "react";
import StopwatchDisplay from "./StopwatchDisplay";
import { deleteLocalStorage, getLocalStorage } from "./helper";

export class App extends Component {
  state = {
    lastBestScore: JSON.parse(getLocalStorage()),
    key: "",
    randomVal: "",
    randomValNumber: 0,
    finalresult: "",
    running: false,
    currentTimeMs: 0,
    currentTimeSec: 0,
    currentTimeMin: 0,
    gameStarted: true,
    totalCorrect:0
  };

  makeid(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  handleKeyDown = (e) => {
    const { randomVal, randomValNumber, gameStarted,lastBestScore,totalCorrect,currentTimeSec } = this.state;
    // console.log(e.keyCode);
    // console.log(e.key);
    const otherValueCheck = e.key !== 'Tab' && 
    e.key !== "Meta" && 
    e.key !== "CapsLock" &&
    e.key !== "Shift" && 
    e.key !=="Enter" && 
    e.key !=="Control" &&
     e.key !=="Alt" && 
     e.key !==" " && 
     e.key !=="`" && 
     e.key !=="Escape" && 
     e.key !=="Backspace" && 
     e.key !=="ArrowUp"&& 
     e.key !=="ArrowDown"&& 
     e.key !=="ArrowLeft"&& 
     e.key !=="ArrowRight";
   if(otherValueCheck){
    if (e.key === randomVal) {
      this.setState({
        key: e.key.toLowerCase(),
        finalresult: "Good result",
        totalCorrect: totalCorrect+1
      });
    } else {
      if (gameStarted === true) {
        this.setState({ currentTimeMs: this.state.currentTimeMs + 500 });
        this.setState({
          key: e.key,
          finalresult: "Bad result",
        });
      }
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.generateValue();
    }, 500);

    if (randomValNumber === 21) {
      this.stop();
      this.setState({
        finalresult: "",
        randomVal: "",
        gameStarted: false,
      });
      if(totalCorrect === 20){
      if(lastBestScore === null){
        localStorage.setItem("gamescore",currentTimeSec)
      }else{
        // console.log('res');
        // console.log(lastBestScore,currentTimeSec)
        if(lastBestScore > currentTimeSec){
          console.log('res');
          deleteLocalStorage();
          localStorage.setItem("gamescore",currentTimeSec)
          window.location.reload(true)
        }
      }
    }
    }
  }
  };

  generateValue = () => {
    const { randomValNumber } = this.state;
    let a = this.makeid(1);
    // console.log(a);
    this.setState({
      finalresult: "",
      randomVal: a,
      randomValNumber: randomValNumber + 1,
    });
  };

  componentDidMount() {
    this.start();
    this.generateValue();
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    this.stop();
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  formatTime = (val, ...rest) => {
    let value = val.toString();
    if (value.length < 2) {
      value = "0" + value;
    }
    if (rest[0] === "ms" && value.length < 3) {
      value = "0" + value;
    }
    return value;
  };

  start = () => {
    if (!this.state.running) {
      this.setState({ running: true });
      this.watch = setInterval(() => this.pace(), 10);
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
  };

  pace = () => {
    this.setState({ currentTimeMs: this.state.currentTimeMs + 10 });
    if (this.state.currentTimeMs >= 1000) {
      this.setState({ currentTimeSec: this.state.currentTimeSec + 1 });
      this.setState({ currentTimeMs: 0 });
    }
    if (this.state.currentTimeSec >= 60) {
      this.setState({ currentTimeMin: this.state.currentTimeMin + 1 });
      this.setState({ currentTimeSec: 0 });
    }
  };

  render() {
    const { randomVal, finalresult, gameStarted, running,lastBestScore } = this.state;

    return (
      <div className="main-area">
        {running}
        <StopwatchDisplay {...this.state} formatTime={this.formatTime} />
        {gameStarted ? (
          <>
            {/* {finalresult === "" ? "Click this" : ""}{" "} */}
            <div className="letter_area">
             <span className="letter">{finalresult === "" ? randomVal : ""} {finalresult}</span>
            </div>
          </>
        ) : (
          <div className="letter_area">
            <span className="letter text-red">Game over</span>
          </div>
        )}
        <div className="scorearea">
          <p className="score">{lastBestScore !==null ? 'Your last best score is '+lastBestScore +' seconds':'Make a good score'} </p>
          <button onClick={()=>window.location.reload(true)}>Retry</button>
        </div>
      </div>
    );
  }
}

export default App;