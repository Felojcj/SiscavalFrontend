import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import BallotIcon from '@material-ui/icons/Ballot';
import EditIcon from '@material-ui/icons/Edit';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

import { GRADUATES_COLUMNS, NEW_STUDENTS_COLUMNS, PROFESOR_COLUMNS } from '../../utils/constants'

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

  & .MuiFormControl-root {
    width: 12rem;
    @media (min-width: 1024px) {
        width: 20rem;
    }
  }
`

const useStyles = makeStyles(() => createStyles({
  menuPaper: {
    maxHeight: 190
  }
}))

const Sie = () => {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [tableData, setTableData] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState([])
  const [sieSelect, setSieSelect] = useState('')
  const [columns, setColumns] = useState(PROFESOR_COLUMNS)
  const classes = useStyles()

  const handleClose = () => setOpen(false)

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/profesor', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setTableData(json)
    })
    .catch(err => console.log(err))
  }, [deleted])

  const selectFetch = (param) => {
    fetch(`http://siscaval.edu.co/api/${param}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      setTableData(json)
      if (param === 'profesor') {
        setColumns(PROFESOR_COLUMNS)
      }

      if (param === 'graduate') {
        setColumns(GRADUATES_COLUMNS)
      }

      if (param === 'new_student') {
        setColumns(NEW_STUDENTS_COLUMNS)
      }
    })
    .catch(err => console.log(err))
  }

  const sieOptions = [
    { 'name': 'Profesores', 'value': 'profesor' },
    { 'name': 'Graduados', 'value': 'graduate' },
    { 'name': 'Inscritos, Admitidos Y Nuevos', 'value': 'new_student' },
    { 'name': 'Matriculados por Genero', 'value': 'enrolled_by_gender' },
    { 'name': 'Matriculados', 'value': 'enrolled' },
    { 'name': 'Tasa de Desercion', 'value': 'defection_rate' },
  ]

  return (
    <StyledTableContainer>
      <Grid container
        justify="space-between"
        alignItems="center">
        <Grid item>
          <TextField
            id="selected_sie"
            name="selected_sie"
            label="¿Que desea consultar?"
            InputProps={{ startAdornment: ( <BallotIcon /> ) }}
            onChange={(e) => {
              setSieSelect(e.target.value)
              selectFetch(e.target.value)
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
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className="create-dependecie_button"
            startIcon={<AddIcon />}
            onClick={() => history.push('/create_users')}
          >
            Importar Archivo
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={tableData}
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
              // deleteUser(...selectedId)
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

export default Sie
