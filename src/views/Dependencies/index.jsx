import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';

import styled from 'styled-components';

const StyledTableContainer = styled.div`
  height: 400px;
  width: 70%;
  margin: 0 auto;
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
    .then(json => setDependencies(json))
    .catch(err => console.log(err))
  }, [])

  const columns = [
    {field: 'id' ,headerName: 'ID', width: 70},
    {field: 'cost_center' ,headerName: 'CENTRO DE COSTOS', width: 130},
    {field: 'description' ,headerName: 'DESCRIPCION', width: 130},
    {field: 'email' ,headerName: 'CORREO', width: 130},
    {field: 'status' ,headerName: 'ESTADO', width: 130},
  ]

  return (
    <StyledTableContainer>
      <button>Crear Dependencia</button>
      <DataGrid rows={dependencies} columns={columns} pageSize={5} checkboxSelection />
    </StyledTableContainer>
  )
}

export default Dependencies
