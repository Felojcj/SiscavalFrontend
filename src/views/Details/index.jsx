import React from 'react'
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
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '50%',
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
      <List className={classes.root}>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar className={classes.orange}>
              {JSON.parse(localStorage.getItem('loginInfo')).name[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Fetch Deatil Name"
            secondary={
              <Box
                display="flex"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                >
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Fetch Data Type
                  </Typography>
                  {" — Fetch Column Name…"}
                </Box>
              </Box>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </StyledDetail>
  )
}

export default Details
