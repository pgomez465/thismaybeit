import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { setRoomId } from "../../actions/index";
import {Row, Col, CardPanel, Input, Button, Icon} from 'react-materialize'

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.updateRoomId = this.updateRoomId.bind(this);
  }
  updateRoomId(event){
    this.props.setRoomId(event.target.value);
  }
  render() {
    return (
      <Row>
        <Col s={12} m={4} ></Col>
        <Col s={12} m={4} className="landing">
          <h2>Imlach Chat<Icon tiny>videocam</Icon></h2>
          <div>
            <Input className="RoomIdInput" placeholder="Enter Driver ID" s={6} onChange={this.updateRoomId} onKeyPress={event => {
              let code = event.keyCode || event.which;
              if(code === 13) { //13 is the enter keycode
                this.props.history.push(this.props.roomId);
              }
            }}></Input>
          </div>
          <Link to={`/${this.props.roomId}`}>
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

const mapDispatchToProps = dispatch => {
  return {
    setRoomId: roomId => dispatch(setRoomId(roomId))
  };
};

const mapStateToProps = state => {
  return { roomId: state.roomId };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
