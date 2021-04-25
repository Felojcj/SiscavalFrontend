import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DescriptionIcon from '@material-ui/icons/Description';
import EmailIcon from '@material-ui/icons/Email';
import Typography from '@material-ui/core/Typography';
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

  & button {
    background-color: #E3C448;
  }

  & button:hover {
    background-color: #FFC400;
  }

  & error {
    color: red;
  }
`

const validationSchema = Yup.object().shape({
  cost_center: Yup.string().matches(/^(C|O)+[0-9]\d*(\.\d+)?$/, 'El formato valido es CO###').required('Centro de Costos es obligatorio'),
  description: Yup.string().required('La descripción es obligatoria'),
  email: Yup.string().email('Ingrese un correo valido').required('El correo es obligatorio')
})

const FormDependencies = () => {
  const history = useHistory()
  const [createDependencieError, setCreateDependencieError] = useState('')
  const [created, setCreated] = useState(false)

  const createDependencie = (cost_center, description, email, status, errorCallback) => {
    fetch('http://siscaval.edu.co/api/dependences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        cost_center,
        description,
        email,
        status
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.status !== "201") errorCallback(json)
      else setCreated(true)
    })
  }

  const handleError = message => setCreateDependencieError(message.data)

  return (
    <Formik
      initialValues={{ cost_center: '', description: '', email: '', status: 1 }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        createDependencie(values.cost_center, values.description, values.email, values.status, handleError)
        if (created) {
          history.push('/dependencies')
        }
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
          Crear Dependencia
        </Typography>
        <StyledDependecieForm  onSubmit={handleSubmit}>
          <Box 
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
          >
            <TextField 
              id="cost_center"
              label="Centro de Costos"
              InputProps={{ startAdornment: ( <BusinessCenterIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.cost_center ? errors.cost_center : ''}
              error={touched.cost_center && errors.cost_center}
              onBlur={handleBlur}
              value={values.cost_center}
            />
            <TextField 
              id="description"
              label="Descripcion"
              InputProps={{ startAdornment: ( <DescriptionIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.description ? errors.description : ''}
              error={touched.description && errors.description}
              onBlur={handleBlur}
              value={values.description}
            />
            <TextField 
              id="email" 
              label="Correo" 
              InputProps={{ startAdornment: ( <EmailIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.email ? errors.email : ''}
              error={touched.email && errors.email}
              onBlur={handleBlur}
              value={values.email}
            />
            <Grid container spacing={1} justify="flex-end" alignItems="center">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<CancelIcon />}
                  fullWidth
                  className='create-cancel_button'
                  onClick={() => history.push('/dependencies')}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<NoteAddIcon />}
                  fullWidth
                  className='create-cancel_button'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Crear
                </Button>
              </Grid>
            </Grid>
            {createDependencieError ?
              (
                <>
                  <p className="error">
                    {createDependencieError.cost_center}
                  </p>
                  <p className="error">
                    {createDependencieError.email}
                  </p>
                </>
              )
                : null
            }
          </Box>
        </StyledDependecieForm>
      </>
    )}
    </Formik>
  )
}

export default FormDependencies
