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
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '60%',
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
  const [failedFetch, setFailedFetch] = useState(false)
  const { id } = useParams()

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
        setDetails(json)
      }
    })
    .catch(err => {
      setFailedFetch(true)
    })
  }, [id])

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
            onClick={() => history.push('/create_templates')}
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
                        flexDirection="row"
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
                        {` Como Minimo Debe Contener ${detail.min_length} Caracteres y un Maximo de ${detail.max_length}`}
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-end"
                      >
                        <Button>Editar</Button>
                        <Button>Eliminar</Button>
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
    </StyledDetail>
  )
}

export default Details
