import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const Main = () => {
  const { email, password } = useContext(AuthContext)
  return (
    <main>
      <h1>Hola</h1>
      <p>{email}</p>
      <p>{password}</p>
    </main>
  )
}

export default Main
