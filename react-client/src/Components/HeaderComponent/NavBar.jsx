import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Navbar, NavItem} from 'react-materialize'
class NavBar extends Component {
  render() {
    return (
      <Navbar brand='VChat' right>
      </Navbar>
    )
  }
}
export default NavBar;
