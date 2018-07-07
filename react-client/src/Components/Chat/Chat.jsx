import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import { Col, CardPanel, Input, Button, Icon} from 'react-materialize'
import { ThemeProvider,FixedWrapper, MessageList, MessageGroup, Message, MessageText, Avatar, Row, TitleBar, IconButton, CloseIcon} from '@livechat/ui-kit'
//Define theme for live chat
const theme = {
  vars: {
    'primary-color': '#427fe1',
    'secondary-color': '#9e9e9e',
    'tertiary-color': '#fff',
    'avatar-border-color': 'blue',
  },
  AgentBar: {
    Avatar: {
      size: '42px',
    },
    css: {
      backgroundColor: 'var(--secondary-color)',
      borderColor: 'var(--avatar-border-color)',
    }
  },
  Message: {
    css: {
      color: '#000'
    },
  },
}

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
      $('.messageBtn').css('color', '#aaa');
      this.props.postMessage(this.state.message);
      this.setState({
        message: ''
      });
    }
  }

  setMessage(event){
    if(event.target.value.length > 0){
      $('.messageBtn').css('color', '#26a69a');
    } else {
      $('.messageBtn').css('color', '#aaa');
    }
    this.setState({
      message: event.target.value
    });
  }

  render(){
    return(
      <div className="ChatDiv">
        <h5> Live Chat <i className="material-icons btn-small title">chat_bubble_outline</i></h5>
        <hr/>
        <div ref={ref => this.chatBox = ref} className="chat">
          <ThemeProvider theme={theme}>
            <MessageList active containScrollInSubtree>
              {this.props.messages.map((message) => {
                return  <Row><Avatar id="name-avatar" isOwn={true} letter={message.username.charAt(0).toUpperCase()} />
                <Message authorName={message.username} date={message.postedOn}>
                  <MessageText style={{"width":"86%"}}>{message.message}</MessageText>
                </Message></Row>
              })}
            </MessageList>
          </ThemeProvider>
        </div>
        <hr/>
        <Input placeholder="Write a message..." value={this.state.message} validate type='text' onChange={this.setMessage} onKeyPress={event => {
          let code = event.keyCode || event.which;
          if(code === 13) { //13 is the enter keycode
            this.post();
          }
        }}>
      </Input>
      <span class="suffix" onClick={this.post}>
        <Icon ref={ref => this.subbmit = ref} className="messageBtn">send</Icon>
      </span>
    </div>
  );
}
}
export default Chat;
