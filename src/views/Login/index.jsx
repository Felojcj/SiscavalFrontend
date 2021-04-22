import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import LoginWrapper from '../../components/LoginWrapper'
import { AuthContext } from '../../contexts/AuthContext'

const Login = () => {
  const { logged } = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    if (!!localStorage.getItem('loginInfo')) localStorage.clear()
  }, [])

  useEffect(() => {
    if (logged && !!localStorage.getItem('loginInfo')) history.push('/main')
  }, [logged, history])

  return (
    <LoginWrapper />
  )
}

export default Login
