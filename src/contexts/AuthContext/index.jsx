import React, { useState, createContext } from 'react'

const AuthContext = createContext({ email: '', password: '' })

const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logged, setLogged] = useState(!!localStorage.getItem('loginInfo'))
  const [loading, setLoading] = useState(false)

  const login = (email, password, errorCallback) => {
    setLoading(true)
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
        setLoading(false)
        localStorage.setItem('loginInfo', JSON.stringify(json))
        setLogged(true)
      } else {
        errorCallback(json.message)
        setLoading(false)
      }
    })
  }

  const logout = () => {
    setLogged(false)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{email, password, login, logged, logout, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export {AuthProvider, AuthContext}
