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

const Users = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [users, setUsers] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState([])

  const handleClose = () => setOpen(false)

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/users/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setUsers(json.filter((obj) => obj.status !== 0))
    })
    .catch(err => console.log(err))
  }, [deleted])

  const deleteUser = (email, status) => {
    fetch('http://siscaval.edu.co/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      },
      body: JSON.stringify({
        email,
        status
      })
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
        enqueueSnackbar('No existe el usuario que se desea eliminar', {
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
    {field: 'username' ,headerName: 'NOMBRE', width: 170},
    {field: 'email' ,headerName: 'CORREO', width: 210},
    {field: 'position' ,headerName: 'CARGO', width: 120},
    {field: 'dependency' ,headerName: 'DEPENDENCIA', width: 160, valueGetter: (params) => params.row.dependency.name},
    {field: 'status' ,headerName: 'ESTADO', width: 110},
    {field: 'actions' ,headerName: 'ACCIONES', width: 140, renderCell:(params) => (
      <>
        <Button onClick={() => history.push(`/edit_users/${params.row.id}`)}>
          <EditIcon />
        </Button>
        <Button onClick={() => {
            setSelectedId([params.row.email, params.row.status])
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
            onClick={() => history.push('/create_users')}
          >Crear Usuario</Button>
        </Grid>
      </Grid>
      <DataGrid 
        rows={users}
        columns={columns}
        pageSize={5}
        checkboxSelection
      />
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          ¿Estas seguro que deseas eliminar este usuario?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recuerda que esta accion es irreversible y el usuario sera eliminada para siempre
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
              deleteUser(...selectedId)
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

export default Users
