import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import AuthRoute from './components/AuthRoute';
import Login from './views/Login';
import Main from './views/Main';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <AuthRoute path='/main' Component={Main} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
