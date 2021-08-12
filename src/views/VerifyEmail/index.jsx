import React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import styled from 'styled-components';
import { Formik } from 'formik'
import { useSnackbar } from 'notistack';
import { useParams, useHistory } from 'react-router-dom'
import * as Yup from 'yup';

import PoliLogo from '../../assets/main-logo.png'

const StyledVerifyEmail = styled.div`
  width: 70%;
  margin: 0 auto;
  height: 100vh;

  & .create-dependecie_button {
    background-color: #E3C448;
    margin: 15px 0;
  }

  & .create-dependecie_button:hover {
    background-color: #FFC400;
  }

  @media (min-width: 1024px) {
    img {
      max-width: 100%;
      height: 160px;
    }
  }
`

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

const VerifyEmail = () => {
  const { message } = useParams()
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
    <StyledVerifyEmail>
      <Box
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <img src={PoliLogo} alt="poli" />
        <Typography 
          variant="h3" 
          gutterBottom
        >
          { message.charAt(0).toUpperCase() + message.slice(1) }
        </Typography>
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
              Por favor cambie su Contraseña para ingresar al sistema
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
      </Box>
    </StyledVerifyEmail>
  )
}

export default VerifyEmail
