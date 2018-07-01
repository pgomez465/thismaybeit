import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import {Row, Col, CardPanel, Input, Button, Icon} from 'react-materialize'
class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      message: ""
    }
    this.post = this.post.bind(this);
    this.setMessage = this.setMessage.bind(this);
  }
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    console.log("scroll to bottom");
    const scrollHeight = this.chatBox.scrollHeight;
    const height = this.chatBox.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.chatBox.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }
  post(){
    if(this.state.message.length > 0){
      this.props.postMessage(this.state.message);
      this.setState({
        message: ''
      });
    }
  }
  setMessage(event){
    this.setState({
      message: event.target.value
    });
  }
  render(){
    return(
      <CardPanel>
        <h5> Room Id : {this.props.roomId} </h5>
        <h6> Live Chat: </h6>
        <hr/>
        <div ref={ref => this.chatBox = ref} className="chat">
        {this.props.messages.map((message) => {
          return <h6>{message.username}: {message.message} </h6>
        })}
        </div>
        <hr/>
        <Input s={6} value={this.state.message} label="Message" onChange={this.setMessage} onKeyPress={event => {
          var code = event.keyCode || event.which;
          if(code === 13) { //13 is the enter keycode
            this.post();
          }
        }}/>
        <Button waves='light' onClick={this.post}><Icon>send</Icon></Button>
      </CardPanel>
    );
  }
}
export default Chat;
