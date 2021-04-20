import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext'
import { withRouter } from 'react-router-dom';

const StyledForm = styled.form`
  width: 70%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-self: center;
  
  & input {
    padding: 8px;
    margin: 13px 0;
    font-family: 'Roboto', sans-serif;
    border-radius: 5px;
    border: none; 
  }
  
  & input[type=submit] {
    background-color: #186844;
    color: white;
    box-shadow: 3px 3px 5px -1px rgb(0 0 0 / 30%);
  }
  
  & h2 {
    color: white;
  }

  & .error {
    color: #FA765B;
    text-align: left;
  }

  @media (min-width: 1024px) {
    margin: 0 15%;
    position: relative;
    top: 0;
    left: 0;
    transform: none;

    & h2 {
      color: #32A457;
    }

    & input {
      border-bottom: 1px solid black;
      border-radius: 0;
    }

    & input:focus {
      outline: none;
    }

    & .error {
      color: red; 
    }
  }
`

const validationSchema = Yup.object().shape({
  email: Yup.string().email().typeError('Ingrese un correo valido').required('El correo es obligatorio'),
  password: Yup.string().min(8, 'La contraseña es de ocho caracteres').required('La contraseña es obligatorio')
})

const LoginForm = () => {
  const { login } = useContext(AuthContext)
  const [loginError, setLoginError] = useState('')

  const handleError = message => setLoginError(message)
  return (
    <Formik
      initialValues={{ email:'', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        login(values.email, values.password, handleError)
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting
      }) => (
        <StyledForm onSubmit={handleSubmit}>
          <h2>Ingreso</h2>
          <input type="email" name="email" id="email" onChange={handleChange} value={values.email} placeholder="Correo..."/>
          {errors.email ? (<div className="error">{errors.email}</div>) : null}
          <input type="password" name="password" id="password" onChange={handleChange} value={values.password}placeholder="Contraseña..."/>
          {errors.password ? (<div className="error">{errors.password}</div>) : null}
          <input type="submit" disabled={isSubmitting} value="Iniciar Sesión"/>
          {loginError ? (<p className="error">{loginError}</p>) : null}
        </StyledForm>
      )}
    </Formik>
  )
}

export default withRouter(LoginForm)
