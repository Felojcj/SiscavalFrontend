import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { es } from 'date-fns/esm/locale';


const StyledTemplate = styled.div`
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

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

const Schedules = () => {
  const classes = useStyles();
  const [schedules, setSchedules] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => setOpen(false)

  const deleteTemplate = (id) => {
    fetch(`http://siscaval.edu.co/api/templates/${id}`, {
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
    fetch('http://siscaval.edu.co/api/schedule', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      setSchedules(json.filter((obj) => obj.status !== 0))
    })
    .catch(err => console.log(err))
  }, [deleted])

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
      <Grid 
        container
        spacing={2}
      >
        {
          schedules.map((schedule, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              key={index}
            >
              <Card className={classes.root}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {`Programacion ${schedule.id}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {`Fecha de inicio: ${format(new Date(`${schedule.start_date}T00:00:00`.replace(/-/g, '/').replace(/T.+/, '')), 'dd/MMMMMM/yyyy', { locale: es })}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {`Fecha fin: ${format(new Date(`${schedule.end_date}T00:00:00`.replace(/-/g, '/').replace(/T.+/, '')), 'dd/MMMMMM/yyyy', { locale: es })}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small"
                    color="inherit"
                    onClick={() => history.push(`/edit_schedule/${schedule.id}`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small"
                    color="inherit"
                    onClick={() => history.push(`/details/${schedule.id}`)}
                  >
                    Importar
                  </Button>
                  <Button 
                    size="small" 
                    color="inherit"
                    onClick={() => {
                      setSelectedId(schedule.id)
                      setOpen(true)
                    }}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        }
      </Grid>
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
    </StyledTemplate>
  )
}

export default Schedules
