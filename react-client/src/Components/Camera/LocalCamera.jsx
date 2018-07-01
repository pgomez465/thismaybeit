import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import Chat from '../Chat/Chat'
import {Row, Col, CardPanel, Input, Button, Icon} from 'react-materialize'
class LocalCamera extends Component {
  constructor(props) {
    super(props);
    this.setUpWebrtc = this.setUpWebrtc.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    //this.readyToCall = this.readyToCall.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
    this.updateRoomId = this.updateRoomId.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.recieveMsg = this.recieveMsg.bind(this);
    this.state = {
      username: '',
      roomId: '',
      messages : [],
      showChat:false,
      others: false
    }
  }
  setUpWebrtc(){
    this.webrtc = new SimpleWebRTC({
      localVideoEl: ReactDOM.findDOMNode(this.refs.local),
      remoteVideosEl: "",
      autoRequestMedia: true,
      nick: this.state.username
      //url: 'https://your-production-signalserver.com/'
    });

    console.log("webrtc component mounted");
    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.connection.on('message', this.recieveMsg)
  }


  addVideo(video, peer) {
    console.log('video added', peer);
    var remotes = ReactDOM.findDOMNode(this.refs.remotes);
    console.log(remotes);
    if (remotes) {
      //construct remote camera video element
      var container = document.createElement('div');
      container.className = 'videoContainer';
      container.style.cssText = "width:20%; display: inline-block;margin-right: 12px;text-align: center";
      container.id = 'container_' + this.webrtc.getDomId(peer);
      var textnode = document.createElement("h6");
      //will replace by real username
      textnode.textContent = peer.nick;
      container.appendChild(textnode);
      container.appendChild(video);
      // suppress contextmenu
      video.oncontextmenu = function() {
        return false;
      };
      console.log(container);
      remotes.appendChild(container);
    }
  }

  removeVideo(video, peer) {
    console.log('video removed ', peer);
    var remotes = ReactDOM.findDOMNode(this.refs.remotes);
    var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
      remotes.removeChild(el);
    }
  }

  updateUserName(event){
    this.setState({
      username: event.target.value
    });
  }

  updateRoomId(event){
    this.setState({
      roomId: event.target.value
    });
  }

  createRoom(){
    if(this.state.roomId && this.state.roomId.length > 0){
      this.setUpWebrtc();
      console.log('Creating new room: ' + this.state.roomId);
      this.webrtc.createRoom(this.state.roomId, (err, name) => {
        if(!err){
          this.setState({
            showChat: true
          });
          this.setUpWebrtc();
        }
      });
    }
  }

  joinRoom(){
    if(this.state.roomId && this.state.roomId.length > 0){
      this.setUpWebrtc();
      console.log('Joining room: ' + this.state.roomId);
      this.webrtc.joinRoom(this.state.roomId, (err, roomDescription) =>{
        if(!err && Object.keys(roomDescription.clients).length){
          this.setState({
            showChat: true
          });
          this.setUpWebrtc();
        }
      });
    }
  }

  postMessage(message){
    let username = this.state.username;
    var chatMessage = {
      username,
      message,
      postedOn: new Date().toLocaleString('en-GB'),
    }
    this.webrtc.sendToAll('chat', chatMessage);
    this.setState({
      messages: [...this.state.messages, chatMessage]
    });
    console.log(123123)
    console.log(this.state.messages);
  }
  // Receive message from remote user
  recieveMsg(data) {
    if (data.type === 'chat') {
      const message = data.payload;
      this.setState({
        messages: [...this.state.messages, message]
      });
    }
  }

  render() {
    return (
    < div >
    {
      this.state.showChat ?
      <Row id="top">
        <Col s={12} m={9} >
        <CardPanel className="remoteCam">
          <h5>Waiting For Others to Join ...</h5>
          < div className = "remotes"
          id = "remoteVideos"
          ref = "remotes" > < /div>
        </CardPanel>
        </Col>
        <Col s={12} m={3} >
        <Chat roomId={this.state.roomId} messages={this.state.messages} postMessage={this.postMessage}/>
        <CardPanel className="">
          <h6>You : {this.state.username}</h6>
          < video className = "local"
          id = "localVideo"
          ref = "local" > < /video>
        </CardPanel>
        </Col>
      </Row>
        :
        <Row className="landing">
          <Col s={12} m={4} ></Col>
          <Col s={12} m={4} >
            <CardPanel className="">
              <Row>
                <Input s={6} label="User Name" onChange={this.updateUserName}/>
                <Input s={6} label="Room Id" onChange={this.updateRoomId}/>
              </Row>
              <Row className="buttonRow">
                <Button waves='light' onClick={this.createRoom}>Create Room</Button>
                <Button waves='light' onClick={this.joinRoom}>Join Room</Button>
              </Row>
            </CardPanel>
          </Col>
          <Col s={12} m={4} ></Col>
        </Row>
    }
    < /div >
    );
  }
}
export default LocalCamera;
