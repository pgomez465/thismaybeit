import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Chat from '../Chat/Chat';
import Clipboard from 'clipboard';
import { connect } from "react-redux";
import { setRoomId, setUserName, addMessage, Mute, reset } from "../../actions/index";
import {Row, Col, CardPanel, Input, Button, Icon} from 'react-materialize';
class LocalCamera extends Component {
  constructor(props) {
    super(props);

    this.props.setRoomId(this.props.match.params.roomId);
    //Video
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.readyToCall = this.readyToCall.bind(this);
    //Chat room
    this.updateUserName = this.updateUserName.bind(this);
    this.procastUsername = this.procastUsername.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    //Volumn
    this.volumeChange = this.volumeChange.bind(this);
    this.remoteVolumeChange = this.remoteVolumeChange.bind(this);
    this.showVolume = this.showVolume.bind(this);
    this.muteToggle = this.muteToggle.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    //Messages
    this.channelMessage = this.channelMessage.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.message = this.message.bind(this);
  }

  componentDidMount() {
    this.webrtc = new SimpleWebRTC({
      localVideoEl: ReactDOM.findDOMNode(this.refs.local),
      remoteVideosEl: "",
      autoRequestMedia: true,
      nick: this.props.userName,
      autoRequestMedia: true,
      debug: false,
      detectSpeakingEvents: true,
      autoAdjustMic: false,
      url: "https://signalmaster-xirsys.herokuapp.com/",
      socketio: {'force new connection':true}
    });

    console.log("webrtc component mounted");
    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.on('readyToCall', this.readyToCall);
    this.webrtc.on('volumeChange', this.volumeChange);
    this.webrtc.on('remoteVolumeChange', this.remoteVolumeChange);
    this.webrtc.on('mute', this.mute);
    this.webrtc.on('unmute', this.unmute);
    this.webrtc.on('channelMessage', this.channelMessage);
    this.webrtc.connection.on('message', this.message);

    const clipboard = new Clipboard('.copylink');
    clipboard.on('success', function(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
      $('.copylink').html('Copied Link!');
    });

  }

  componentWillUnmount(){

  }

  volumeChange(volume, treshold){
    //console.log('local volumn change');
    this.showVolume(document.getElementById('localVolume'), volume);
  }

  remoteVolumeChange(peer, volume){
    //console.log('remote volumn change');
    this.showVolume(document.getElementById('volume_' + peer.id), volume);
  }

  addVideo(video, peer) {
    console.log('video added', peer);
    const remotes = ReactDOM.findDOMNode(this.refs.remotes);
    if (remotes) {
      //construct remote camera video element
      const container = document.createElement('div');
      container.className = 'videoContainer';
      container.style.cssText = "width:30%; display: inline-block;margin-right: 12px;text-align: center";
      container.id = 'container_' + this.webrtc.getDomId(peer);
      const textnode = document.createElement("h6");
      //will replace by real username
      textnode.textContent = peer.nick;
      container.appendChild(textnode);
      container.appendChild(video);
      // add muted and paused elements
      const mutedIcon = document.createElement('i');
      mutedIcon.className = 'Small material-icons title green-text';
      mutedIcon.innerHTML = 'mic';
      container.appendChild(mutedIcon);
      // show the remote volume
      const vol = document.createElement('meter');
      vol.id = 'volume_' + peer.id;
      vol.className = 'volume';
      vol.min = -45;
      vol.max = -20;
      vol.low = -40;
      vol.high = -25;
      container.appendChild(vol);
      // suppress contextmenu
      video.oncontextmenu = function() {
        return false;
      };
      remotes.appendChild(container);
      setTimeout(() =>{
        this.webrtc.sendDirectlyToAll(this.props.roomId, "setDisplayName", this.props.userName);
      }, 1000);
    }
  }

  removeVideo(video, peer) {
    console.log('video removed ', peer);
    const remotes = ReactDOM.findDOMNode(this.refs.remotes);
    const el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
      remotes.removeChild(el);
    }
  }

  readyToCall() {
    console.log("I am ready to call and join");
    this.joinRoom();
  }

  updateUserName(event){
    this.props.setUserName(event.target.value);
  }

  procastUsername(){
    this.webrtc.sendDirectlyToAll(this.props.roomId, "setDisplayName", this.props.userName);
  }

  createRoom(){
    console.log('Creating new room: ' + this.props.roomId);
    this.webrtc.createRoom(this.props.roomId, (err, name) => {
      this.postMessage(this.props.userName + " created chatroom");
    });
  }

  joinRoom(){
    console.log('Joining room: ' + this.props.roomId);
    this.webrtc.joinRoom(this.props.roomId, (err, roomDescription) =>{
        this.postMessage(this.props.userName + " joined chatroom");
    });
  }

  leaveRoom(){
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
    this.webrtc.connection.disconnect();
    this.webrtc.disconnect();
    this.postMessage(this.props.userName + " left chatroom");
    this.props.reset();
  }

  muteToggle(){
    console.log("mute: " + this.props.mute)
    if(!this.props.mute){
      this.webrtc.mute();
    } else {
      this.webrtc.unmute();
    }
    this.props.Mute();
  }

  // helper function to show the volume
  showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) volume = -45;
    if (volume > -20) volume = -20;
    el.value = volume;
  }

  mute(data){
    this.webrtc.getPeers(data.id).forEach( (peer) => {
      if (data.name == 'audio') {
        $('#container_' + this.webrtc.getDomId(peer) + ' > i').html('mic_off');
        $('#container_' + this.webrtc.getDomId(peer) + ' > i').removeClass('green-text').addClass('red-text');
      }
    });
  }

  unmute(data){
    this.webrtc.getPeers(data.id).forEach( (peer) => {
      if (data.name == 'audio') {
        $('#container_' + this.webrtc.getDomId(peer) + ' > i').html('mic');
        $('#container_' + this.webrtc.getDomId(peer) + ' > i').removeClass('red-text').addClass('green-text');
      }
    });
  }

  channelMessage(peer, label, data){
    if (data.type == 'setDisplayName') {
      let name = data.payload;
      $('#container_' + this.webrtc.getDomId(peer) + ' > h6').html(name);
    }
  }

  postMessage(message){
    const username = this.props.userName;
    const chatMessage = {
      username,
      message,
      postedOn: new Date().toLocaleString('en-GB'),
    }
    console.log(chatMessage);
    this.props.addMessage(chatMessage);
    this.webrtc.sendToAll('chat', chatMessage);
  }

  message(data){
    if (data.type === 'chat') {
      const recievedMsg = data.payload;
      this.props.addMessage(recievedMsg);
    }
  }

  render() {
    const isEnabled =
    this.props.userName.length > 0 &&
    this.props.roomId.length > 0;
    return (
      <Row id="top">
        <Col s={12} m={2} >
          <Chat postMessage={this.postMessage}/>
        </Col>
        <Col s={12} m={8} className="roomContainer">
          <h5>
            <i class="material-icons title">group</i> Room : {this.props.roomId}
          </h5>
          <p id="bg-text">Others can join you by going to {window.location.href}</p>
          <div className = "remotes" id = "remoteVideos" ref = "remotes"> </div>
        </Col>
        <Col s={12} m={2}>

            <div className="videoContainer">
              <Button className='button copylink' data-clipboard-text={window.location.href} waves='light'>
                Invite
                <Icon left tiny>link</Icon>
              </Button>
              <Link to="/">
                <Button className='button btn-flat grey lighten-2' waves='light' onClick={this.leaveRoom}>
                  Leave
                  <Icon className="red-text" left tiny>call_end</Icon>
                </Button>
              </Link>
              <Input s={12} placeholder="Your Name (press enter)" validate onChange={this.updateUserName} onKeyPress={event => {
                let code = event.keyCode || event.which;
                if(code === 13) { //13 is the enter keycode
                  this.procastUsername();
                }
              }}>
                <Icon className="username">account_circle</Icon>
              </Input>
              <video className = "local"
              id = "localVideo"
              ref = "local"> </video>
              <a class="waves-effect waves-light grey lighten-2" onClick={this.muteToggle}>
                <i className={`Small material-icons title ${this.props.mute ? "red-text" : "green-text"}`}>{this.props.mute ? "mic_off" : "mic"}</i>
              </a>
              <meter id="localVolume" className="volume" min="-45" max="-20" low="-40" high="-25"></meter>
            </div>
          </Col>
        </Row>
      );
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      setRoomId: roomId => dispatch(setRoomId(roomId)),
      setUserName: username => dispatch(setUserName(username)),
      addMessage: message => dispatch(addMessage(message)),
      Mute: toggle => dispatch(Mute(toggle)),
      reset: () => dispatch(reset())
    };
  };

  const mapStateToProps = state => {
    return {
      roomId: state.roomId,
      userName: state.userName,
      messages: state.messages,
      mute: state.mute
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(LocalCamera);
