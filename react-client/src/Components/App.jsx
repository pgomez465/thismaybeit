import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { browserHistory , Switch} from 'react-router';
import CreateRoom from './Setup/CreateRoom';
import LocalCamera from './Camera/LocalCamera';
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={CreateRoom}/>
          <Route exact path="/:roomId" component={LocalCamera}/>
        </Switch>
      </Router>
    )
  }
}
export default App;
