import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const StyledValidValues = styled.div`
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

const ValidValues = () => {
  const { id } = useParams()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [failedFetch, setFailedFetch] = useState(false)
  const [validValues, setValidValues] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const handleClose = () => setOpen(false)

  const deleteValidValue = (id) => {
    fetch(`http://siscaval.edu.co/api/valid-value/${id}`, {
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
    fetch(`http://siscaval.edu.co/api/valid-values/${id}`, {
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
        setValidValues(json.filter((obj) => obj.status !== 0))
      }
    })
    .catch(err => {
      setFailedFetch(true)
    })
  }, [id, deleted])

  return (
    <StyledValidValues>
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
            onClick={() => history.push(`/create_valid_values/${id}`)}
          >
            Crear Valor Valido
          </Button>
        </Grid>
      </Grid>
      <List>
        {!failedFetch ? (
          <>
            {
              validValues.map((validValue, index) => (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: '#32A457' }}>
                      <AccessibilityIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={validValue.value.charAt(0).toUpperCase() + validValue.value.slice(1)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end"
                      aria-label="edit"
                      onClick={() => history.push(`/edit_valid_values/detail/${id}/valid_values/${validValue.id}`)}
                      style={{ color: 'black' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      style={{ color: 'black' }}
                      onClick={() => {
                        setSelectedId(validValue.id)
                        setOpen(true)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
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
      </List>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          ¿Estas seguro que deseas eliminar este valor valido?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recuerda que esta accion es irreversible y el valor valido sera eliminada para siempre
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
              deleteValidValue(selectedId)
              handleClose()
            }} 
            color="primary" 
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </StyledValidValues>
  )
}

export default ValidValues
