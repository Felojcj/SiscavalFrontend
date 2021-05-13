import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DescriptionIcon from '@material-ui/icons/Description';
import EmailIcon from '@material-ui/icons/Email';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import DomainIcon from '@material-ui/icons/Domain';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';
import { Formik } from 'formik'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import * as Yup from 'yup';

const useStyles = makeStyles(() => createStyles({
  menuPaper: {
    maxHeight: 190
  }
}))

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
  cost_center: Yup.string().matches(/^(C|O)+[0-9]\d*(\.\d+)?$/, 'El formato valido es CO###').required('Centro de Costos es obligatorio'),
  description: Yup.string().required('La descripción es obligatoria'),
  email: Yup.string().email('Ingrese un correo valido').required('El correo es obligatorio')
})

const FormTemplate = () => {
  const history = useHistory()
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [loaded, setLoaded] = useState(false)
  const [dependencyData, setDependencyData] = useState([])
  const [templateToEdit, setTemplateToEdit] = useState({
    name: '',
    description: '',
    id_dependence: ''
  })
  const classes = useStyles()

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/dependences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setDependencyData(json.filter((obj) => obj.status !== 0))
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (!!id) {
      fetch(`http://siscaval.edu.co/api/dependences/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
        }
      })
      .then(res => res.json())
      .then(json => {
        setTemplateToEdit({
          cost_center: json.cost_center,
          description: json.description,
          email: json.email
        })
        setLoaded(true)
      })
      .catch(err => console.log(err))
    } else {
      setLoaded(true)
    }
  }, [id])

  const createDependency = (cost_center, description, email, status, errorCallback) => {
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
      if (json.status !== "201") {
        errorCallback(json)
      }
      else {
        enqueueSnackbar('Creado Correctamente', {
          variant: 'success', 
          autoHideDuration: 5000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
        history.push('/dependencies')
      }
    })
  }

  const editDependency = (cost_center, description, email, errorCallback) => {
    fetch(`http://siscaval.edu.co/api/dependences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        cost_center,
        description,
        email
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.status !== "200") {
        errorCallback(json)
      }
      else {
        enqueueSnackbar('Actualizado Correctamente', {
          variant: 'success', 
          autoHideDuration: 5000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
        history.push('/dependencies')
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

  return loaded ? (
    <Formik
      initialValues={{
        name: templateToEdit.name,
        description: templateToEdit.description,
        id_dependence: templateToEdit.id_dependence,
        status: 1 
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        if (!!id) {
          console.log('Yes')
          editDependency(values.cost_center, values.description, values.email, handleError)
        } else {
          console.log('No')
          createDependency(values.cost_center, values.description, values.email, values.status, handleError)
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
          {!!id ? 'Editar Plantilla' : 'Crear Plantilla'}
        </Typography>
        <StyledDependecieForm  onSubmit={handleSubmit}>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
          >
            <TextField
              id="name"
              label="Nombre"
              InputProps={{ startAdornment: ( <BusinessCenterIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.name ? errors.name : ''}
              error={!!touched.name && !!errors.name}
              onBlur={handleBlur}
              value={values.name}
            />
            <TextField
              id="description"
              label="Descripcion"
              InputProps={{ startAdornment: ( <DescriptionIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.description ? errors.description : ''}
              error={!!touched.description && !!errors.description}
              onBlur={handleBlur}
              value={values.description}
            />
<TextField
              id="id_dependence"
              name="id_dependence"
              label="Dependencia"
              InputProps={{ startAdornment: ( <DomainIcon /> ) }}
              onChange={handleChange}
              helperText={touched.id_dependence ? errors.id_dependence : ''}
              error={!!touched.id_dependence && !!errors.id_dependence}
              onBlur={handleBlur}
              value={values.id_dependence}
              select
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null,
                  classes: {
                    paper: classes.menuPaper
                  }
                },
                IconComponent: (props) => (<ExpandMoreIcon {...props}/>)
              }}
            >
              {dependencyData.map((dependency, index) => (
                <MenuItem 
                  value={dependency.id}
                  key={index}>
                    {`${dependency.id} - ${dependency.description}`}
                </MenuItem>)
              )}
            </TextField>
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
                  endIcon={!!id ? <EditIcon /> : <NoteAddIcon />}
                  fullWidth
                  className='create-cancel_button'
                  type='submit'
                  disabled={isSubmitting}
                >
                  {!!id ? 'Editar' : 'Crear'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </StyledDependecieForm>
      </>
    )}
    </Formik>
  ) : (<Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress  style={{color: '#196844'}}/>
      </Box>)
}

export default FormTemplate

