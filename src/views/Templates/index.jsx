import React from 'react';
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
            >
              Crear Plantilla
            </Button>
          </Grid>
        </Grid>
      </StyledTemplate>
      <Grid 
        container
        justify="center"
        spacing="3"
      >
        <Grid item xs={9} sm={2}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={ExcelIcon}
              title="Sample Text"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                From Template Fetch Name
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                From Template Fetch Description
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
        <Grid item xs={9} sm={2}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={ExcelIcon}
              title="Sample Text"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                From Template Fetch Name
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                From Template Fetch Description
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
        <Grid item xs={9} sm={2}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={ExcelIcon}
              title="Sample Text"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                From Template Fetch Name
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                From Template Fetch Description
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
      </Grid>
    </>
  )
}

export default Templates
