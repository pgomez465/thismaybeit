import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import {Row, Col, CardPanel, Input, Button, Icon} from 'react-materialize'
class LocalCamera extends Component {
  constructor(props) {
    super(props);
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.readyToCall = this.readyToCall.bind(this);
    //this.createRoom = this.createRoom.bind(this);
    //this.joinRoom = this.joinRoom.bind(this);
    this.state = {
      username: 'tylermcginnis',
      room: ''
    }
  }
  componentDidMount() {
    this.webrtc = new SimpleWebRTC({
      localVideoEl: ReactDOM.findDOMNode(this.refs.local),
      remoteVideosEl: "",
      autoRequestMedia: true
      //url: 'https://your-production-signalserver.com/'
    });

    console.log("webrtc component mounted");
    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.on('readyToCall', this.readyToCall);
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
      textnode.textContent = "Username";
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
  //
  removeVideo(video, peer) {
    console.log('video removed ', peer);
    var remotes = ReactDOM.findDOMNode(this.refs.remotes);
    var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
      remotes.removeChild(el);
    }
  }
  //
  readyToCall() {
    return this.webrtc.joinRoom('change-this-roomname');
  }
  //
  // connect() {
  //   console.log("connected");
  // }
  //
  // disconnect() {
  //   console.log("disconnected");
  // }

  render() {
    return (
    < div >
    <Row id="top">
      <Col s={12} m={7} >
        <CardPanel className="">
          <Row>
            <Input s={6} label="User Name" />
            <Input s={6} label="Room Id" />
          </Row>
          <Row>
          <Button waves='light' right>Create Room</Button>
          <Button waves='light' right>Join Room</Button>
          </Row>
        </CardPanel>
      </Col>
      <Col s={12} m={1} >
      </Col>
      <Col s={12} m={3}>
        <CardPanel className="">
          <h5>You</h5>
          < video className = "local"
          id = "localVideo"
          ref = "local" > < /video>
        </CardPanel>
      </Col>
      <Col s={12} m={1} >
      </Col>
    </Row>
    <Row>
      <CardPanel className="">
        <h5>Remote Camera</h5>
        < div className = "remotes"
        id = "remoteVideos"
        ref = "remotes" > < /div>
      </CardPanel>
    </Row>
    < /div >
    );
  }
}
export default LocalCamera;
