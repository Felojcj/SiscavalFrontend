import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import AuthRoute from './components/AuthRoute';
import Login from './views/Login';
import Main from './views/Main';
import{ AuthContext } from './contexts/AuthContext'
import { useContext } from 'react';

function App() {
  const { logged }  = useContext(AuthContext)
  console.log(logged)
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" render={() => (
            logged ?
            (<Redirect to='/main' />)
            :
            (<Redirect to='/login' />)
          )}/>
          <AuthRoute path='/main' Component={Main} />
          <Route path='/login'>
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
