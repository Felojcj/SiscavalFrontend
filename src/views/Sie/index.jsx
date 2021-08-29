import React, { useEffect, useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import BallotIcon from '@material-ui/icons/Ballot';
import GetAppIcon from '@material-ui/icons/GetApp';
import FilterListIcon from '@material-ui/icons/FilterList';
import CancelIcon from '@material-ui/icons/Cancel';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import SendIcon from '@material-ui/icons/Send';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import WorkIcon from '@material-ui/icons/Work';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import { Formik } from 'formik'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { GRADUATES_COLUMNS, NEW_STUDENTS_COLUMNS, PROFESOR_COLUMNS, ENROLLED_BY_GENDER_COLUMNS, ENROLLED_COLUMNS, DEFECTION_RATE_COLUMNS } from '../../utils/constants'

const StyledTableContainer = styled.div`
  height: 400px;
  width: 70%;
  margin: 0 auto;

  .download-sie_button {
    background-color: #F1F1F1;
    margin: 15px 0;
    color: black;
  }

  .download-sie_button:hover {
    background-color: #C1C1C1;
  }

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
  const [tableData, setTableData] = useState([])
  const [sieSelect, setSieSelect] = useState('profesor')
  const [columns, setColumns] = useState(PROFESOR_COLUMNS)
  const [render, setRender] = useState(false)
  const classes = useStyles()

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
  }, [])

  const selectFetch = (param, faculty, semester, campus, program, formation_level, dedication) => {
    fetch(`http://siscaval.edu.co/api/${param}?faculty=${faculty || ''}&semester=${semester || ''}&campus=${campus || ''}&program=${program || ''}&formation_level=${formation_level || ''}&dedication=${dedication || ''}`, {
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

      if (param === 'enrolled_by_gender') {
        setColumns(ENROLLED_BY_GENDER_COLUMNS)
      }

      if (param === 'enrolled') {
        setColumns(ENROLLED_COLUMNS)
      }

      if (param === 'defection_rate') {
        setColumns(DEFECTION_RATE_COLUMNS)
      }
    })
    .catch(err => console.log(err))
  }

  const exportSie = (param) => {
    fetch(`http://siscaval.edu.co/api/export_${param}`, {
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
        download: param,
      }).click();
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
            endIcon={<FilterListIcon />}
            onClick={() => setRender(!render)}
          >
            Filtros
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className="create-dependecie_button"
            startIcon={<AddIcon />}
            onClick={() => history.push('/sie_import')}
          >
            Importar Archivo
          </Button>
        </Grid>
      </Grid>
      {render ? 
        (
          <Formik
            initialValues={{
              faculty: '',
              semester: '',
              campus: '',
              program: '',
              formation_level: '',
              dedication: ''
            }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false)
              selectFetch(sieSelect, values.faculty, values.semester, values.campus, values.program, values.formation_level, values.dedication)
              setRender(false)
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
            <form onSubmit={handleSubmit}>
              <Box
                display='flex'
                flexDirection='row'
                flexWrap='wrap'
              >
                <TextField
                  id="faculty"
                  name="faculty"
                  label="Facultad"
                  InputProps={{ startAdornment: ( <AccountBalanceIcon /> ) }} 
                  onChange={handleChange}
                  helperText={touched.faculty ? errors.faculty : ''}
                  error={!!touched.faculty && !!errors.faculty}
                  onBlur={handleBlur}
                  value={values.faculty}
                  style={{ marginBottom: '10px', marginRight: '10px' }}
                />
                <TextField
                  id="semester"
                  name="semester"
                  label="Semestre"
                  InputProps={{ startAdornment: ( <DateRangeIcon /> ) }} 
                  onChange={handleChange}
                  helperText={touched.semester ? errors.semester : ''}
                  error={!!touched.semester && !!errors.semester}
                  onBlur={handleBlur}
                  value={values.semester}
                  style={{marginBottom: '10px', marginRight: '10px'}}
                />
                {sieSelect === 'profesor' ?
                  (
                    <>
                      <TextField
                        id="campus"
                        name="campus"
                        label="Sede"
                        InputProps={{ startAdornment: ( <LocationCityIcon /> ) }} 
                        onChange={handleChange}
                        helperText={touched.campus ? errors.campus : ''}
                        error={!!touched.campus && !!errors.campus}
                        onBlur={handleBlur}
                        value={values.campus}
                        style={{marginBottom: '10px', marginRight: '10px'}}
                      />
                      <TextField
                        id="formation_level"
                        name="formation_level"
                        label="Nivel de Formacion"
                        InputProps={{ startAdornment: ( <PermDataSettingIcon /> ) }} 
                        onChange={handleChange}
                        helperText={touched.formation_level ? errors.formation_level : ''}
                        error={!!touched.formation_level && !!errors.formation_level}
                        onBlur={handleBlur}
                        value={values.formation_level}
                        style={{marginBottom: '10px', marginRight: '10px'}}
                      />
                      <TextField
                        id="dedication"
                        name="dedication"
                        label="Dedicacion"
                        InputProps={{ startAdornment: ( <WorkIcon /> ) }} 
                        onChange={handleChange}
                        helperText={touched.dedication ? errors.dedication : ''}
                        error={!!touched.dedication && !!errors.dedication}
                        onBlur={handleBlur}
                        value={values.dedication}
                      />
                    </>
                  )
                  :
                  (
                    <TextField
                      id="program"
                      name="program"
                      label="Programa"
                      InputProps={{ startAdornment: ( <MenuBookIcon /> ) }} 
                      onChange={handleChange}
                      helperText={touched.program ? errors.program : ''}
                      error={!!touched.program && !!errors.program}
                      onBlur={handleBlur}
                      value={values.program}
                    />
                  )
                }
              </Box>
              <Grid container
                justify="flex-end"
                alignItems="center"
                spacing={4}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    className="create-dependecie_button"
                    endIcon={<CancelIcon/>}
                    onClick={() => setRender(false)}
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    className="create-dependecie_button"
                    endIcon={<SendIcon />}
                    type='submit'
                    disabled={isSubmitting}
                  >
                    Filtrar
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
          </Formik>
        )
        : null
      }
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={5}
        checkboxSelection
      />
      <Grid 
        container
        justify="flex-end"
        alignItems="center"
      >
        <Grid item>
          <Button
              variant="contained"
              color="primary"
              className="download-sie_button"
              endIcon={<GetAppIcon />}
              onClick={() => exportSie(sieSelect || "profesor")}
            >
            Descargar
          </Button>
        </Grid>
      </Grid>
    </StyledTableContainer>
  )
}

export default Sie
