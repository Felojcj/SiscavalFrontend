import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import ExcelIcon from '../../assets/excel.svg'

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

const Templates = () => {
  const classes = useStyles();
  const [templates, setTemplates] = useState([])
  const history = useHistory()

  useEffect(() => {
    fetch('http://siscaval.edu.co/api/templates', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loginInfo')).token}`
      }
    })
    .then(res => res.json())
    .then(json => setTemplates(json))
    .catch(err => console.log(err))
  }, [])

  return (
    <>
      <StyledTemplate>
        <Grid container 
          justify="flex-end"
          alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className="create-dependecie_button"
              startIcon={<AddIcon />}
              onClick={() => history.push('/create_templates')}
            >
              Crear Plantilla
            </Button>
          </Grid>
        </Grid>
      </StyledTemplate>
      <Grid 
        container
        justify="center"
        spacing={3}
      >
        {
          templates.map((template, index) => (
            <Grid
              item
              xs={9}
              sm={4}
              lg={2}
              key={index}
            >
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  image={ExcelIcon}
                  title="Sample Text"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {template.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {template.dependency.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="inherit">
                    Editar
                  </Button>
                  <Button size="small" color="inherit">
                    Detalle
                  </Button>
                  <Button size="small" color="inherit">
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </>
  )
}

export default Templates
