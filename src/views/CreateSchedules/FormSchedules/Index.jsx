import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';
import { Formik } from 'formik'
import { useHistory } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { useParams } from 'react-router-dom'
import { makeStyles, createStyles } from '@material-ui/core/styles';
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
  start_date: Yup.date().typeError('La fecha de inicio no es valida').required('La fecha de inicio es requerida'),
  end_date: Yup.date().typeError('La fecha fin no es valida').required('La fecha de fin es requerida'),
  id_user: Yup.string().required('El usuario es requerido'),
  id_template: Yup.string().required('La plantilla es requerida'),
})

const FormSchedules = () => {
  const history = useHistory()
  const { idvvalue, id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [loaded, setLoaded] = useState(false)
  const [scheduleToEdit, setScheduleToEdit] = useState({
    start_date: new Date(),
    end_date: new Date(),
    id_user: '',
    id_template: '',
  })
  const [userData, setUserData] = useState([])
  const [templateData, setTemplateData] = useState([])
  const classes = useStyles()

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/users/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setUserData(json.filter((obj) => obj.status !== 0))
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/templates', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setTemplateData(json.filter((obj) => obj.status !== 0))
      console.log(json)
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (!!id) {
      fetch(`http://siscaval.edu.co/api/valid-value/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
        }
      })
      .then(res => res.json())
      .then(json => {
        setScheduleToEdit({
          value: json.value.charAt(0).toUpperCase() + json.value.slice(1),
        })
        setLoaded(true)
      })
      .catch(err => console.log(err))
    } else {
      setLoaded(true)
    }
  }, [id])

  const createValidValue = (value, id_detail, status, errorCallback) => {
    fetch('http://siscaval.edu.co/api/valid-value', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        value,
        id_detail,
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
        history.push(`/valid_values/${id_detail}`)
      }
    })
  }

  const editValidValue = (value, errorCallback) => {
    fetch(`http://siscaval.edu.co/api/valid-value/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        value,
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
        history.push(`/valid_values/${idvvalue}`)
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
        start_date: scheduleToEdit.start_date,
        end_date: scheduleToEdit.end_date,
        id_user: scheduleToEdit.id_user,
        id_template: scheduleToEdit.id_template,
        status: 1
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        if (!!id) {
          editValidValue(values.value, handleError)
        } else {
          createValidValue(values.value, idvvalue, values.status, handleError)
        }
      }}
    >
    {({
      values,
      setFieldValue,
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
          {!!id ? 'Editar Programacion' : 'Crear Programacion'}
        </Typography>
        <StyledDependecieForm  onSubmit={handleSubmit}>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                name="start_date"
                onBlur={handleBlur}
                error={!!touched.start_date && !!errors.start_date}
                helperText={touched.start_date ? errors.start_date : ''}
                label="Fecha de inicio"
                format="yyyy/dd/MM"
                value={values.start_date}
                onChange={(date) => setFieldValue('start_date',date)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
                margin="normal"
                name="end_date"
                onBlur={handleBlur}
                error={!!touched.end_date && !!errors.end_date}
                helperText={touched.end_date ? errors.end_date : ''}
                label="Fecha fin"
                format="yyyy/dd/MM"
                value={values.end_date}
                onChange={(date) => setFieldValue('end_date', date)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              id="id_user"
              name="id_user"
              label="Usuario"
              InputProps={{ startAdornment: ( <AccountBoxIcon /> ) }}
              onChange={handleChange}
              helperText={touched.id_user ? errors.id_user : ''}
              error={!!touched.id_user && !!errors.id_user}
              onBlur={handleBlur}
              value={values.id_user}
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
              {userData.map((user, index) => (
                <MenuItem 
                  value={user.id}
                  key={index}>
                    {`${user.id} - ${user.username}`}
                </MenuItem>)
              )}
            </TextField>
            <TextField
              id="id_template"
              name="id_template"
              label="Plantilla"
              InputProps={{ startAdornment: ( <FindInPageIcon /> ) }}
              onChange={handleChange}
              helperText={touched.id_template ? errors.id_template : ''}
              error={!!touched.id_template && !!errors.id_template}
              onBlur={handleBlur}
              value={values.id_template}
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
              {templateData.map((template, index) => (
                <MenuItem 
                  value={template.id}
                  key={index}>
                    {`${template.id} - ${template.name}`}
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
                  onClick={() => history.push(`/valid_values/${idvvalue}`)}
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

export default FormSchedules

