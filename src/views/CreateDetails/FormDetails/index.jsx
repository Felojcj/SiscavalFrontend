import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import ListAltIcon from '@material-ui/icons/ListAlt';
// import DescriptionIcon from '@material-ui/icons/Description';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
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
  column_name: Yup.string().required('El nombre de la columna es requerida').min(4),
  data_type: Yup.string().required('El tipo de dato es requerida'),
  id_template: Yup.string().required('La platilla es requerida'),
})

const FormDetails = () => {
  const history = useHistory()
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [loaded, setLoaded] = useState(false)
  const [templateData, setTemplateData] = useState([])
  const [detailToEdit, setDetailToEdit] = useState({
    column_name: '',
    data_type: '',
    id_template: ''
  })
  const classes = useStyles()

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
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (!!id) {
      fetch(`http://siscaval.edu.co/api/templates/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
        }
      })
      .then(res => res.json())
      .then(json => {
        setDetailToEdit({
          name: json.name,
          description: json.description,
          id_dependence: json.id_dependence
        })
        setLoaded(true)
      })
      .catch(err => console.log(err))
    } else {
      setLoaded(true)
    }
  }, [id])

  const createDetail = (column_name, data_type, id_template, status, errorCallback) => {
    fetch('http://siscaval.edu.co/api/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        column_name,
        data_type,
        id_template,
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
        history.push(`/details/${id_template}`)
      }
    })
  }

  const editTemplate = (name, description, id_dependence, errorCallback) => {
    fetch(`http://siscaval.edu.co/api/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        name,
        description,
        id_dependence
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
        history.push('/templates')
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
        column_name: detailToEdit.column_name,
        data_type: detailToEdit.data_type,
        id_template: detailToEdit.id_template,
        status: 1
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        if (!!id) {
          editTemplate(values.name, values.description, values.id_dependence, handleError)
        } else {
          createDetail(values.column_name, values.data_type, values.id_template, values.status, handleError)
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
          {!!id ? 'Editar Detalle' : 'Crear Detalle'}
        </Typography>
        <StyledDependecieForm  onSubmit={handleSubmit}>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
          >
            <TextField
              id="column_name"
              name="column_name"
              label="Nombre de la Columna"
              InputProps={{ startAdornment: ( <ListAltIcon /> ) }} 
              onChange={handleChange}
              helperText={touched.column_name ? errors.column_name : ''}
              error={!!touched.column_name && !!errors.column_name}
              onBlur={handleBlur}
              value={values.column_name}
            />
            <TextField
              id="data_type"
              name="data_type"
              label="Tipo de dato"
              InputProps={{ startAdornment: ( <SupervisedUserCircleIcon /> ) }}
              onChange={handleChange}
              helperText={touched.data_type ? errors.data_type : ''}
              error={!!touched.data_type && !!errors.data_type}
              onBlur={handleBlur}
              value={values.data_type}
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
              <MenuItem value="numeric">Numerico</MenuItem>
              <MenuItem value="date">Fecha</MenuItem>
              <MenuItem value="string">Cadena de Caracteres</MenuItem>
              <MenuItem value="email">Direccion de Correo Electronico</MenuItem>
            </TextField>
            <TextField
              id="id_template"
              name="id_template"
              label="Plantilla"
              InputProps={{ startAdornment: ( <DomainIcon /> ) }}
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
                  onClick={() => history.push('/templates')}
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

export default FormDetails

