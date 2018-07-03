import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { browserHistory } from 'react-router';
import NavBar from './HeaderComponent/NavBar';
import LocalCamera from './Camera/LocalCamera';
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <LocalCamera />
        </div>
      </Router>
    )
  }
}
export default App;
