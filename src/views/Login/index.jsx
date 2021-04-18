import React, { useEffect } from 'react'
import LoginWrapper from '../../components/LoginWrapper'


const Login = () => {
  useEffect(() => {
    if (!!sessionStorage.getItem('email')) sessionStorage.clear()
  }, [])

  return (
    <LoginWrapper />
  )
}

export default Login
