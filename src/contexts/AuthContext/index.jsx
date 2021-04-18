import React, { useState, createContext } from 'react'

const AuthContext = createContext({ email: '', password: '' })

const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = (email, password) => {
    setEmail(email)
    setPassword(password)
    sessionStorage.setItem('email', email)
  }

  return (
    <AuthContext.Provider value={{email, password, login}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthProvider, AuthContext}
