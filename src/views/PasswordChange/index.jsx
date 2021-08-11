import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import MailIcon from '@material-ui/icons/Mail';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SendIcon from '@material-ui/icons/Send';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import * as Yup from 'yup';

const StyledDependecieForm = styled.form`
  width: 80%;
  margin: 0 auto;
  & div {
    margin: 5px 0; 
  }

  @media (min-width: 1024px) {
    width: 70%;
  }

  @media (min-width: 1440px) {
    width: 50%;
  }

  & .create-cancel_button {
    background-color: #E3C448;
  }

  & .create-cancel_button:hover {
    background-color: #FFC400;
  }
`

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Ingrese un correo valido').required('El correo es obligatorio'),
  password: Yup.string().required('La contraseña es requerida').min(8),
  password_confirmation: Yup.string().required('La confirmacion de la contraseña es requerida').min(8)
})

const PasswordChange = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const changePassword = (email, password, password_confirmation, errorCallback) => {
    fetch(`http://siscaval.edu.co/api/password/reset?token=${JSON.parse(localStorage.getItem('loginInfo')).token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.status !== "201") {
        errorCallback(json)
      }
      else {
        enqueueSnackbar('Contraseña Cambiada Correctamente', {
          variant: 'success', 
          autoHideDuration: 5000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
      }
    })
  }

  const handleError = message => {
    for(const errorSnack in message.data) {
      enqueueSnackbar(message.data[errorSnack][0], {
        variant: 'error', 
        autoHideDuration: 7000, 
        anchorOrigin: { 
          vertical: 'bottom', 
          horizontal: 'center' 
        } 
      })
    }
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        password_confirmation: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        changePassword(values.email, values.password, values.password_confirmation, handleError)
      }}
    >
    {({
      values,
      errors,
      touched,
      handleChange,
      handleSubmit,
      isSubmitting,
      handleBlur
    }) => (
      <>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          style={{ marginTop: '15px' }}
        >
          Cambiar Contraseña
        </Typography>
        <StyledDependecieForm  onSubmit={handleSubmit}>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
          >
            <TextField
              id="email"
              name="email"
              label="Correo Asociado a su Cuenta"
              InputProps={{ startAdornment: ( <MailIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.email ? errors.email : ''}
              error={!!touched.email && !!errors.email}
              onBlur={handleBlur}
              value={values.email}
            />
            <TextField
              id="password"
              name="password"
              label="Contraseña Nueva"
              InputProps={{ startAdornment: ( <LockOpenIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.password ? errors.password : ''}
              error={!!touched.password && !!errors.password}
              onBlur={handleBlur}
              value={values.password}
            />
            <TextField
              id="password_confirmation"
              name="password_confirmation"
              label="Confirmar Contraseña Nueva"
              InputProps={{ startAdornment: ( <LockOpenIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.password_confirmation ? errors.password_confirmation : ''}
              error={!!touched.password_confirmation && !!errors.password_confirmation}
              onBlur={handleBlur}
              value={values.password_confirmation}
            />
            <Grid container spacing={1} justify="flex-end" alignItems="center">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<CancelIcon />}
                  fullWidth
                  className='create-cancel_button'
                  onClick={() => history.push(`/main`)}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  fullWidth
                  className='create-cancel_button'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Cambiar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </StyledDependecieForm>
      </>
    )}
    </Formik>
  )}

export default PasswordChange

