const React = require('react');
const { default: Try } = require('./Try');
const { Component } = React;


function getNumbers(){
  //정답만들기(랜덤)
  const shuffle = [];
  const arr = [1,2,3,4,5,6,7,8,9];
  for(let i=0; i<4; i++) {
    const num = arr.splice(Math.floor(Math.random() * (9-i)), 1)[0]; //0~9
    shuffle.push(num);
  }
  return shuffle
}

class NumberBaseball extends Component {
  state = {
    value: '',
    answer: getNumbers(),
    result: '',
    tries: [], //react에 불변성때문에 push사용불가(원본변경메서드)
  };

  onSubmit = e => {
    e.preventDefault();
    if(this.state.value === this.state.answer.join('')){
      this.setState({
        result:'홈런',
        tries: [...this.state.tries, {try: this.state.value, result: '홈런!'}],
      })
    } else {
      const answerArray = this.state.value.split('').map((v)=>parseInt(v));
      let strike = 0;
      let ball = 0;
      if ( this.state.tries.length >= 9 ) { //10번 이상 틀렸을때
        this.setState({
          result: `10번넘게 틀려서 실패! 답은 ${this.state.answer.join(',')}였습니다!`,
        });
        alert('게임을 다시 시작합니다.');
        this.setState({
          value: '',
          answer: getNumbers(),
          tries: [],
        });
      } else {
        for (let i=0; i<4; i++) {
          if(answerArray[i] === this.state.answer[i]) {
            strike += 1;
          } else if(this.state.answer.includes(answerArray[i])) {
            ball += 1;
          }
        }
        this.setState({
          tries: [...this.state.tries, {try: this.state.value, result: `${strike}스트라이크, ${ball}볼`}],
          value: '',
        });
      }
    }
  };

  onChange = e => {
    console.log(this.state.answer)
    this.setState({ value: e.target.value })
  }

  render() {
    return (
      <>
      <h1>{this.state.result}</h1>
        <form onSubmit={this.onSubmit}>
          <input maxLength={4} onChange={this.onChange} value={this.state.value}/>
          {/* maxLength로 최대 적을 수 있는 길이 지정가능 */}
          {/* input이 한개면 엔터로도 submit가능함 */}
        </form>
        <div>시도: {this.state.tries.length}</div>
        <ul>
          {this.state.tries.map((v,i) => 
          // v,i를 받아주기 위해서 다른 컴포넌트에 props로 전달함 
          // props로 받을 단어 = {현재 컴포넌트에서 전달할 단어}
          // 반복문에서 key가 필요함
          //현재 v는 뒤의 객체를 의미함:  {try:this.state.value, result: `${strike}스트라이크, ${ball}볼`}
            <Try key={`${i} + 1차 시도`} tryInfo={v} />)} 
        </ul>
      </>
    );
  }
}

module.exports = NumberBaseball;