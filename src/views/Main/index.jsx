import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


const Main = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <Typography 
        variant="h3"
        style={{
          margin: '3rem auto 0',
          color: '#E4C33E',
          fontWeight: 'bold'
        }}
      >
        SISCAVAL
      </Typography>
      <Box 
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          width: '70%',
          margin: '3rem auto 0'
        }}
      >
        <iframe width="560" height="315" src="https://www.youtube.com/embed/MuT8_OQUdkw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </Box>
      <Typography 
        variant="h4"
        style={{
          margin: '3rem auto 0',
          fontWeight: 'bold'
        }}
      >
        Preguntas Frecuentes
      </Typography>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
        style={{
          margin: '2rem auto 0'
        }}
      >
        <ListItem button onClick={handleClick}>
          <ListItemText primary="Primera Pregunta Frecuente" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemText primary="Respuesta a la Pregunta" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </>
  )
}

export default Main
