import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { useHistory } from 'react-router-dom';

const Main = () => {
  const { email, password, logout } = useContext(AuthContext)
  const history = useHistory()

  const loginLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <main>
      <h1>Hola</h1>
      <p>{email}</p>
      <p>{password}</p>
      <button onClick={() => loginLogout()}>Cerrar Sesión</button>
    </main>
  )
}

export default Main
