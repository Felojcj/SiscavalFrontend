import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DraftsIcon from '@material-ui/icons/Drafts';
import WorkIcon from '@material-ui/icons/Work';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import DomainIcon from '@material-ui/icons/Domain';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  name: Yup.string().required('El nombre es obligatorio').min(2, 'El nombre debe contener dos o mas caracteres').matches(/^[a-zA-Z]+$/gi, 'El nombre solo debe contener letras'),
  email: Yup.string().email('Ingrese un correo valido').required('El correo es obligatorio'),
  position: Yup.string().required('El cargo es obligatoria').min(4, 'El cargo debe contener 4 o mas caracteres').matches(/^[a-zA-Z]+$/gi, 'El cargo solo debe contener letras'),
  id_dependence: Yup.string().required('La dependencia es requerida'),
  is_admin: Yup.string().required('El rol es requerido') 
})

const FormUsers = () => {
  const history = useHistory()
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [loaded, setLoaded] = useState(false)
  const [dependencyData, setDependencyData] = useState([])
  const [userToEdit, setUserToEdit] = useState({
    name: '',
    email: '',
    position: '',
    id_dependence: '',
    is_admin: ''
  })
  const classes = useStyles()

  useEffect(() => {
    if (!!id) {
      fetch(`http://siscaval.edu.co/api/users/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
        }
      })
      .then(res => res.json())
      .then(json => {
        setUserToEdit({
          name: json.name,
          email: json.email,
          position: json.position,
          id_dependence: json.id_dependence,
          is_admin: json.is_admin
        })
        setLoaded(true)
      })
      .catch(err => console.log(err))
    } else {
      setLoaded(true)
    }
  }, [id])

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

  const createUser = (name, email, position, id_dependence, is_admin, status, errorCallback) => {
    fetch('http://siscaval.edu.co/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        position,
        id_dependence,
        is_admin,
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
        history.push('/users')
      }
    })
  }

  const editUser = (name, email, position, id_dependence, is_admin, errorCallback) => {
    fetch(`http://siscaval.edu.co/api/edit-user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        name,
        email,
        position,
        id_dependence,
        is_admin
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
        history.push('/users')
      }
    })
  }

  const handleError = message => {
    console.log(message)
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
        name: userToEdit.name,
        email: userToEdit.email,
        position: userToEdit.position,
        id_dependence: userToEdit.id_dependence,
        is_admin: userToEdit.is_admin,
        status: 1
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        if (!!id) {
          editUser(values.name, values.email, values.position, values.id_dependence, values.is_admin, handleError)
        } else {
          createUser(values.name, values.email, values.position, values.id_dependence, values.is_admin, values.status, handleError)
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
          {!!id ? 'Editar Usuario' : 'Crear Usuario'}
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
              InputProps={{ startAdornment: ( <PeopleAltIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.name ? errors.name : ''}
              error={!!touched.name && !!errors.name}
              onBlur={handleBlur}
              value={values.name}
            />
            <TextField
              id="email"
              label="Correo"
              InputProps={{ startAdornment: ( <DraftsIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.email ? errors.email : ''}
              error={!!touched.email && !!errors.email}
              onBlur={handleBlur}
              value={values.email}
            />
            <TextField
              id="position"
              label="Cargo"
              InputProps={{ startAdornment: ( <WorkIcon /> ) }}
              onChange={handleChange}
              helperText={touched.position ? errors.position : ''}
              error={!!touched.position && !!errors.position}
              onBlur={handleBlur}
              value={values.position}
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
            <TextField
              id="is_admin"
              name="is_admin"
              label="Rol"
              InputProps={{ startAdornment: ( <SupervisedUserCircleIcon /> ) }}
              onChange={handleChange}
              helperText={touched.is_admin ? errors.is_admin : ''}
              error={!!touched.is_admin && !!errors.is_admin}
              onBlur={handleBlur}
              value={values.is_admin}
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
              <MenuItem value={1}>Administrador</MenuItem>
              <MenuItem value={0}>Usuario</MenuItem>
            </TextField>
            <Grid container spacing={1} justify="flex-end" alignItems="center">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<CancelIcon />}
                  fullWidth
                  className='create-cancel_button'
                  onClick={() => history.push('/users')}
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

export default FormUsers
