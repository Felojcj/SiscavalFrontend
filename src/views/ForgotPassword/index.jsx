import React from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';
import { Formik } from 'formik'
import { useHistory } from 'react-router-dom';
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
})

const ForgotPassword = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const sendResetPasswordEmail = (email, errorCallback) => {
    fetch('http://siscaval.edu.co/api/password/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      if (json.status !== "200") {
        errorCallback(json)
      }
      else {
        enqueueSnackbar('Operacion exitosa, revise su correo y siga las indicaciones', {
          variant: 'success', 
          autoHideDuration: 5000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
        history.push(`/main`)
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
        email: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        sendResetPasswordEmail(values.email, handleError)
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
              label="Ingrese su Correo"
              InputProps={{ startAdornment: ( <MailIcon  /> ) }} 
              onChange={handleChange}
              helperText={touched.email ? errors.email : ''}
              error={!!touched.email && !!errors.email}
              onBlur={handleBlur}
              value={values.value}
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

export default ForgotPassword
