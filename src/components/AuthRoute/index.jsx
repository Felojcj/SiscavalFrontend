import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const AuthRoute = ({ Component, path, exact = false }) => {
  const isAuth = !!localStorage.getItem('loginInfo')

  return (
    <Route path={path} exact={exact} render={(props) => 
      isAuth ? (
        <Component {...props} />
      ) :
      (
        <Redirect to={{pathname: '/'}}/>
      )}
    />
  )
}

export default AuthRoute
