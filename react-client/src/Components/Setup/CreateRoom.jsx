import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Row, Col, CardPanel, Input, Button, Icon} from 'react-materialize'
class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: ''
    }
    this.updateRoomId = this.updateRoomId.bind(this);
  }
  updateRoomId(event){
    this.setState({
      roomId: event.target.value
    });
  }
  render() {
    return (
      <Row>
        <Col s={12} m={4} ></Col>
        <Col s={12} m={4} className="landing">
          <h2>VChat<Icon tiny>videocam</Icon></h2>
          <div>
            <Input className="RoomIdInput" placeholder="Choose a room name" s={6} onChange={this.updateRoomId} onKeyPress={event => {
              let code = event.keyCode || event.which;
              if(code === 13) { //13 is the enter keycode
                this.props.history.push(this.state.roomId);
              }
            }}></Input>
          </div>
          <Link to={`/${this.state.roomId}`}>
            <Button waves='light'>
              Start a chat
            </Button>
          </Link>
        </Col>
        <Col s={12} m={4} ></Col>
      </Row>
    )
  }
}
export default CreateRoom;
