import React, { useState, createContext } from 'react'

const AuthContext = createContext({ email: '', password: '' })

const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logged, setLogged] = useState(!!localStorage.getItem('loginInfo'))

  const login = (email, password, errorCallback) => {
    setEmail(email)
    setPassword(password)
    fetch('http://siscaval.edu.co/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(res => res.json())
    .then(json => {
      if (!!json.token) {
        localStorage.setItem('loginInfo', JSON.stringify(json))
        setLogged(true)
      } else {
        errorCallback(json.message)
      }
    })
  }

  const logout = () => setLogged(false)

  return (
    <AuthContext.Provider value={{email, password, login, logged, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthProvider, AuthContext}
