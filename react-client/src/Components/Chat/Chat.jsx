import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { setMessage, addMessage } from "../../actions/index";
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
    if(this.props.message.length > 0){
      $('.messageBtn').css('color', '#aaa');
      this.props.postMessage(this.props.message);
      this.props.setMessage("");
    }
  }

  setMessage(event){
    if(event.target.value.length > 0){
      $('.messageBtn').css('color', '#26a69a');
    } else {
      $('.messageBtn').css('color', '#aaa');
    }
    this.props.setMessage(event.target.value);
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
                <Message style={{"width":"100%"}} authorName={message.username} date={message.postedOn}>
                  <MessageText style={{"width":"100%"}}>{message.message}</MessageText>
                </Message></Row>
              })}
            </MessageList>
          </ThemeProvider>
        </div>
        <hr/>
        <div>
          <Col s={12} m={10} >
            <Input placeholder="Write a message..." value={this.props.message} validate type='text' onChange={this.setMessage} onKeyPress={event => {
              let code = event.keyCode || event.which;
              if(code === 13) { //13 is the enter keycode
                this.post();
              }
            }}>
          </Input>
        </Col>
        <Col s={12} m={2} >
          <span class="suffix" onClick={this.post}>
            <Icon ref={ref => this.subbmit = ref} className="messageBtn">send</Icon>
          </span>
        </Col>
      </div>
    </div>
  );
}
}

const mapDispatchToProps = dispatch => {
  return {
    addMessage: message => dispatch(addMessage(message)),
    setMessage: message => dispatch(setMessage(message))
  };
};

const mapStateToProps = state => {
  return {
    userName: state.userName,
    messages: state.messages,
    message: state.message
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
