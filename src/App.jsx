import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import './App.css';
import{ AuthContext } from './contexts/AuthContext'
import AuthRoute from './components/AuthRoute';
import Login from './views/Login';
import Main from './views/Main';
import Dependencies from './views/Dependencies'
import HeaderWrapper from './components/HeaderWrapper'
import CreateDependencies from './views/CreateDependencies'

function App() {
  const { logged }  = useContext(AuthContext)
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
          <AuthRoute path='/create_dependencies' Component={CreateDependencies} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
