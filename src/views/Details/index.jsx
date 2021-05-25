import React, { useEffect, useState } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '70%',
    margin: '0 auto',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  orange: {
    color: 'white',
    backgroundColor: '#32A457'
  }
}))

const StyledDetail = styled.div`
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

const Details = () => {
  const classes = useStyles()
  const history = useHistory()
  const [details, setDetails] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [failedFetch, setFailedFetch] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => setOpen(false)

  const deleteTemplate = (id) => {
    fetch(`http://siscaval.edu.co/api/details/${id}`, {
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
        enqueueSnackbar('No existe la plantilla que se desea eliminar', {
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
    fetch(`http://siscaval.edu.co/api/details/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })  
    .then(res => res.json())
    .then(json => {
      if (json.status === '404') {
        setFailedFetch(true)
      } else {
        setDetails(json.filter((obj) => obj.status !== 0))
      }
    })
    .catch(err => {
      setFailedFetch(true)
    })
  }, [id, deleted])

  

  return (
    <StyledDetail>
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
            onClick={() => history.push(`/create_details/${id}`)}
          >
            Crear Detalle
          </Button>
        </Grid>
      </Grid>
      {!failedFetch ? (
        <>
          {
            details.map((detail, index) => (
              <List className={classes.root} key={index}>
                <ListItem alignItems="center">
                  <ListItemAvatar>
                    <Avatar className={classes.orange}>
                      {JSON.parse(localStorage.getItem('loginInfo')).name[0]}
                    </Avatar>
                  </ListItemAvatar>
                <ListItemText
                  primary={detail.column_name.charAt(0).toUpperCase() + detail.column_name.slice(1)}
                  secondary={
                    <Box
                      display="flex"
                      flexDirection="column"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {`${detail.data_type.charAt(0).toUpperCase() + detail.data_type.slice(1)}`}
                        </Typography>
                        {` Los datos de la columna ${detail.column_name} debe coincidir con el tipo de dato especificado (${detail.data_type}) `}
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-end"
                      >
                        <Button
                          onClick={() => history.push(`/edit_details/template/${id}/details/${detail.id}`)}
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedId(detail.id)
                            setOpen(true)
                          }}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </Box>
                  }
                />
                </ListItem>
              <Divider variant="inset" component="li" />
              </List>
            ))
          }
        </>
      ) :
        <Typography
          component="h2"
          color="textPrimary"
        >
          Informacion no encontrada
        </Typography>
      }
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          ¿Estas seguro que deseas eliminar esta detalle?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recuerda que esta accion es irreversible y el detalle sera eliminada para siempre
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
              deleteTemplate(selectedId)
              handleClose()
            }} 
            color="primary" 
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </StyledDetail>
  )
}

export default Details
