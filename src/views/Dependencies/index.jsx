import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

const StyledTableContainer = styled.div`
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

const Dependencies = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [dependencies, setDependencies] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const handleClose = () => setOpen(false)

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/dependences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setDependencies(json.filter((obj) => obj.id !== 1 && obj.status !== 0))
    })
    .catch(err => console.log(err))
  }, [deleted])

  const deleteDependecy = (id) => {
    fetch(`http://siscaval.edu.co/api/dependences/${id}`, {
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
        enqueueSnackbar('No existe la dependencia que se desea eliminar', {
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

  const columns = [
    {field: 'id' ,headerName: 'ID', width: 70},
    {field: 'cost_center' ,headerName: 'CENTRO DE COSTOS', width: 190},
    {field: 'description' ,headerName: 'DESCRIPCION', width: 170},
    {field: 'email' ,headerName: 'CORREO', width: 230},
    {field: 'status' ,headerName: 'ESTADO', width: 110},
    {field: 'actions' ,headerName: 'ACCIONES', width: 150, renderCell:(params) => (
      <>
        <Button onClick={() => history.push(`/edit_dependencies/${params.row.id}`)}>
          <EditIcon />
        </Button>
        <Button onClick={() => {
            setSelectedId(params.row.id)
            setOpen(true)
          }}
        >
          <DeleteSweepIcon />
        </Button>
      </>
    )},
  ]

  return (
    <StyledTableContainer>
      <Grid container 
        justify="flex-end"
        alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className="create-dependecie_button"
            startIcon={<AddIcon />}
            onClick={() => history.push('/create_dependencies')}
          >Crear Dependencia</Button>
        </Grid>
      </Grid>
      <DataGrid 
        rows={dependencies}
        columns={columns}
        pageSize={5}
        checkboxSelection
      />
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          ¿Estas seguro que deseas eliminar esta dependencia?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recuerda que esta accion es irreversible y la dependencia sera eliminada para siempre
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
              deleteDependecy(selectedId)
              handleClose()
            }} 
            color="primary" 
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </StyledTableContainer>
  )
}

export default Dependencies
