import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid } from '@material-ui/data-grid';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GetAppIcon from '@material-ui/icons/GetApp';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { DropzoneDialog } from 'material-ui-dropzone'

const StyledTemplate = styled.div`
  height: 400px;
  width: 70%;
  margin: 0 auto;
  & .create-dependecie_button {
    background-color: #E3C448;
    margin: 15px 0;
  }
  & .create-dependecie_button:hover {
    background-color: #FFC400;
  }
`

const useStyles = makeStyles((theme) => ({
  media: {
    height: 140,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
}));

const Schedules = () => {
  const classes = useStyles();
  const [schedules, setSchedules] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedIdTemplate, setSelectedIdTemplate] = useState('')
  const [openUploadFile, setOpenUploadFile] = useState(false)
  const [importing, setImporting] = useState(false)
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => setOpen(false)

  const deleteSchedule = (id) => {
    fetch(`http://siscaval.edu.co/api/schedule/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === '200') {
        setDeleted(!deleted)
        enqueueSnackbar('Eliminado Correctamente', {
          variant: 'success', 
          autoHideDuration: 4000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
      } else {
        enqueueSnackbar('No existe la programacion que se desea eliminar', {
          variant: 'error', 
          autoHideDuration: 4000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
      }
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/schedule', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setSchedules(json.filter((obj) => obj.status !== 0))
    })
    .catch(err => console.log(err))
  }, [deleted])

  const importFile = (file, id_template, id) => {
    const data = new FormData()
    data.append('import_file', file[0])
    data.append('id_template', id_template)
    setImporting(true)

    fetch(`http://siscaval.edu.co/api/import/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`,
      },
      body: data
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === '201') {
        setDeleted(!deleted)
        enqueueSnackbar('Importado Correctamente', {
          variant: 'success',
          autoHideDuration: 2000,
          anchorOrigin: { 
            vertical: 'bottom',
            horizontal: 'center'
          } 
        })
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
    .catch(err => {
      console.log(err)
      setImporting(false)
    })
  }

  const downloadExcel = (id, filename) => {
    fetch(`http://siscaval.edu.co/api/download/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(href => {
      Object.assign(document.createElement('a'), {
        href,
        download: filename,
      }).click();
    })
    .catch(err => console.log(err))
  }

  const columns = [
    {field: 'id' ,headerName: 'ID', width: 70},
    {field: 'name' ,headerName: 'NOMBRE', width: 190},
    {field: 'start_date' ,headerName: 'FECHA DE INICIO', width: 170},
    {field: 'end_date' ,headerName: 'FECHA FIN', width: 130},
    {field: 'implementation_date' ,headerName: 'FECHA DE IMPLEMENTACION', width: 250},
    {field: 'download' ,headerName: 'DESCARGA', width: 270, renderCell:(params) => (
      <>
        {
          !!params.row.path ? 
            (
              <Button
                color="primary"
                size="small"
                className={classes.button}
                endIcon={<GetAppIcon />}
                onClick={() => downloadExcel(params.row.id, params.row.path.split('/')[1])}
              >
                {
                  params.row.path.split('/')[1].split('-')[0] + ' - ' + new Date(params.row.path.split('/')[1].split('-')[1].split('.')[0] * 1000).toLocaleDateString() + ' ' + new Date(params.row.path.split('/')[1].split('-')[1].split('.')[0] * 1000).toLocaleTimeString()
                }
              </Button>
            ) : null
        }
      </>
    )},
    {field: 'actions' ,headerName: 'ACCIONES', width: 400, renderCell:(params) => (
      <>
        <Button 
          size="small"
          color="inherit"
          onClick={() => history.push(`/edit_schedule/${params.row.id}`)}
        >
          Editar
        </Button>
        <Button 
          size="small"
          color="inherit"
          onClick={() => {
            setSelectedIdTemplate(params.row.template.id)
            setSelectedId(params.row.id)
            setOpenUploadFile(true)
          }}
        >
          Importar
        </Button>
        <Button 
          size="small" 
          color="inherit"
          onClick={() => {
            setSelectedId(params.row.id)
            setOpen(true)
          }}
        >
          Eliminar
        </Button>
      </>
    )},
  ]

  return (
    <StyledTemplate>
      <Grid container 
        justify="flex-end"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className="create-dependecie_button"
            startIcon={<AddIcon />}
            onClick={() => history.push('/create_schedules')}
          >
            Crear Programacion
          </Button>
        </Grid>
      </Grid>
      <DataGrid 
        rows={schedules}
        columns={columns}
        pageSize={5}
      />
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          ¿Estas seguro que deseas eliminar esta plantilla?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recuerda que esta accion es irreversible y la plantilla sera eliminada para siempre
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
              deleteSchedule(selectedId)
              handleClose()
            }} 
            color="primary" 
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <DropzoneDialog
        open={openUploadFile}
        onSave={(file) => importFile(file, selectedIdTemplate, selectedId)}
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
    </StyledTemplate>
  )
}

export default Schedules
