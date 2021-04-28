import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
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
  const { enqueueSnackbar } = useSnackbar()
  const [dependencies, setDependencies] = useState([])
  const [deleted, setDeleted] = useState(false)

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
          autoHideDuration: 7000, 
          anchorOrigin: { 
            vertical: 'bottom', 
            horizontal: 'center' 
          } 
        })
      } else {
        enqueueSnackbar('No existe la dependencia que se desea elimianr', {
          variant: 'error', 
          autoHideDuration: 7000, 
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
        <Button onClick={() => console.log(params)}>
          <EditIcon />
        </Button>
        <Button onClick={ () => deleteDependecy(params.row.id)}>
          <DeleteSweepIcon />
        </Button>
      </>
    )},
  ]

  const history = useHistory()

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
    </StyledTableContainer>
  )
}

export default Dependencies
