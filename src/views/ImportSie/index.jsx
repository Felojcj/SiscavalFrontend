import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import BallotIcon from '@material-ui/icons/Ballot';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { DropzoneDialog } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack';

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

const useStyles = makeStyles((theme) => createStyles({
  menuPaper: {
    maxHeight: 190
  },
  media: {
    height: 140,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
}))

const ImportSie = () => {
  const history = useHistory()
  const [sieSelect, setSieSelect] = useState('')
  const [importing, setImporting] = useState(false)
  const [openUploadFile, setOpenUploadFile] = useState(false)
  const sieOptions = [
    { 'name': 'Profesores', 'value': 'profesor' },
    { 'name': 'Graduados', 'value': 'graduate' },
    { 'name': 'Inscritos, Admitidos Y Nuevos', 'value': 'new_student' },
    { 'name': 'Matriculados por Genero', 'value': 'enrolled_by_gender' },
    { 'name': 'Matriculados', 'value': 'enrolled' },
    { 'name': 'Tasa de Desercion', 'value': 'defection_rate' },
  ]
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const selectFetch = (param, file) => {
    const data = new FormData()
    data.append('import_file', file[0])
    setImporting(true)

    fetch(`http://siscaval.edu.co/api/import_${param}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: data
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === '201') {
        enqueueSnackbar('Importado Correctamente', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: { 
            vertical: 'bottom',
            horizontal: 'center'
          } 
        })
        history.push('/sie')
      } else {
        enqueueSnackbar('Error al Validar el documento, revise el archivo antes de subirlo', {
          variant: 'error', 
          autoHideDuration: 2000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
      }
      setOpenUploadFile(false)
      setImporting(false)
    })
    .catch(err => console.log(err))
  }

  return (
    <>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        style={{ marginTop: '15px' }}
      >
        Importar Archivo
      </Typography>
      <StyledDependecieForm>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
        >
          <TextField
            id="selected_sie"
            name="selected_sie"
            label="¿Que desea consultar?"
            InputProps={{ startAdornment: ( <BallotIcon /> ) }}
            onChange={(e) => {
              setSieSelect(e.target.value)
            }}
            value={sieSelect}
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
            {sieOptions.map((sieOption, index) => (
              <MenuItem value={sieOption.value} key={index}>{sieOption.name}</MenuItem>
            ))}
          </TextField>
          <Grid container spacing={1} justify="flex-end" alignItems="center">
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<CancelIcon />}
                fullWidth
                className='create-cancel_button'
                onClick={() => history.push(`/sie`)}
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
                disabled={!sieSelect}
                onClick={() => setOpenUploadFile(true)}
              >
                Importar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </StyledDependecieForm>
      <DropzoneDialog
        open={openUploadFile}
        onSave={(file) => selectFetch(sieSelect, file)}
        acceptedFiles={['application/vnd.ms-excel ', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
        showPreviews={true}
        filesLimit={1}
        maxFileSize={5000000}
        onClose={() => setOpenUploadFile(false)}
        dropzoneText={'Arrastre aqui el archivo o haga click para seleccionar'}
        dialogTitle={'Importar archivos'}
        cancelButtonText={'Cancelar'}
        submitButtonText={'Importar'}
      />
      <Backdrop className={classes.backdrop} open={importing}>
        <CircularProgress color="inherit" />
        Importando...
      </Backdrop>
    </>
  )
}

export default ImportSie

