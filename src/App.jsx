import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { SnackbarProvider } from 'notistack';

import './App.css';
import{ AuthContext } from './contexts/AuthContext'
import AuthRoute from './components/AuthRoute';
import Login from './views/Login';
import Main from './views/Main';
import Dependencies from './views/Dependencies'
import HeaderWrapper from './components/HeaderWrapper'
import CreateDependencies from './views/CreateDependencies'
import Users from './views/Users'
import CreateUsers from './views/CreateUsers'
import Templates from './views/Templates'
import CreateTemplates from './views/CreateTemplates'
import Details from './views/Details'
import CreateDetails from './views/CreateDetails'
import CreateValidValues from './views/CreateValidValues'
import ValidValues from './views/ValidValues'
import Schedules from './views/Schedules'
import CreateSchedules from './views/CreateSchedules'
import Sie from './views/Sie'
import ImportSie from './views/ImportSie'
import VerifyEmail from './views/VerifyEmail'
import PasswordChange from './views/PasswordChange'
import ForgotPassword from './views/ForgotPassword'

function App() {
  const { logged }  = useContext(AuthContext)
  return (
    <div className="App">
      <SnackbarProvider>
        <Router>
          <HeaderWrapper />
          <Switch>
            <Route path='/login' render={() => (
              logged ?
                (<Redirect to='/main' />)
                :
                (<Login />)
            )}/>
            <Route path='/verify-email/:message' render={() => (
              logged ?
                (<Redirect to='/main' />)
                :
                (<VerifyEmail />)
            )}/>
            <Route path='/verify-email' render={() => (
              logged ?
                (<Redirect to='/main' />)
                :
                (<Redirect to='/login' />)
            )}/>
            <Route path='/change-password/:token' render={() => <PasswordChange />}/>
            <Route exact path="/" render={() => (
              logged ?
                (<Redirect to='/main' />)
                :
                (<Redirect to='/login' />)
            )}/>
            <AuthRoute path='/main' Component={Main} />
            <AuthRoute path='/dependencies' Component={Dependencies} />
            <AuthRoute path='/create_dependencies' Component={CreateDependencies} />
            <AuthRoute path='/edit_dependencies/:id' Component={CreateDependencies} />
            <AuthRoute path='/users' Component={Users} />
            <AuthRoute path='/create_users' Component={CreateUsers} />
            <AuthRoute path='/edit_users/:id' Component={CreateUsers} />
            <AuthRoute path='/templates' Component={Templates} />
            <AuthRoute path='/create_templates' Component={CreateTemplates} />
            <AuthRoute path='/edit_templates/:id' Component={CreateTemplates} />
            <AuthRoute path='/details/:id' Component={Details} />
            <AuthRoute path='/create_details/:iddetail' Component={CreateDetails} />
            <AuthRoute path='/edit_details/template/:iddetail/details/:id' Component={CreateDetails} />
            <AuthRoute path='/valid_values/:id' Component={ValidValues} />
            <AuthRoute path='/create_valid_values/:idvvalue' Component={CreateValidValues} />
            <AuthRoute path='/edit_valid_values/detail/:idvvalue/valid_values/:id' Component={CreateValidValues} />
            <AuthRoute path='/schedules' Component={Schedules} />
            <AuthRoute path='/create_schedules' Component={CreateSchedules} />
            <AuthRoute path='/edit_schedule/:id' Component={CreateSchedules} />
            <AuthRoute path='/sie' Component={Sie} />
            <AuthRoute path='/sie_import' Component={ImportSie} />
            <AuthRoute path='/change-password-logged' Component={ForgotPassword} />
          </Switch>
        </Router>
      </SnackbarProvider>
    </div>
  );
}

export default App;
