import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import './App.css';
import AuthRoute from './components/AuthRoute';
import Login from './views/Login';
import Main from './views/Main';
import Dependencies from './views/Dependencies'
import{ AuthContext } from './contexts/AuthContext'
import HeaderWrapper from './components/HeaderWrapper'

function App() {
  const { logged }  = useContext(AuthContext)
  console.log(logged)
  return (
    <div className="App">
      <Router>
        <HeaderWrapper />
        <Switch>
          <Route path='/login'>
              <Login />
          </Route>
          <Route exact path="/" render={() => (
            logged ?
            (<Redirect to='/main' />)
            :
            (<Redirect to='/login' />)
          )}/>
          <AuthRoute path='/main' Component={Main} />
          <AuthRoute path='/dependencies' Component={Dependencies} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
