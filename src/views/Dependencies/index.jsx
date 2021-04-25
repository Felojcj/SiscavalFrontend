import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

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
  const [dependencies, setDependencies] = useState([])
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
  }, [])

  const columns = [
    {field: 'id' ,headerName: 'ID', width: 70},
    {field: 'cost_center' ,headerName: 'CENTRO DE COSTOS', width: 190},
    {field: 'description' ,headerName: 'DESCRIPCION', width: 170},
    {field: 'email' ,headerName: 'CORREO', width: 230},
    {field: 'status' ,headerName: 'ESTADO', width: 130},
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
      <DataGrid rows={dependencies} columns={columns} pageSize={5} checkboxSelection />
    </StyledTableContainer>
  )
}

export default Dependencies
