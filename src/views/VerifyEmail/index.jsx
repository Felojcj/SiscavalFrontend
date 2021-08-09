import React from 'react'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components';

import PoliLogo from '../../assets/main-logo.png'

const StyledVerifyEmail = styled.div`
  width: 70%;
  margin: 0 auto;
  height: 100vh;

  & .create-dependecie_button {
    background-color: #E3C448;
    margin: 15px 0;
  }

  & .create-dependecie_button:hover {
    background-color: #FFC400;
  }

  @media (min-width: 1024px) {
    img {
      max-width: 100%;
      height: 160px;
    }
  }
`

const VerifyEmail = () => {
  const { message } = useParams()
  const history = useHistory()

  return (
    <StyledVerifyEmail>
      <Box
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <img src={PoliLogo} alt="poli" />
        <Typography 
          variant="h3" 
          gutterBottom
        >
          { message.charAt(0).toUpperCase() + message.slice(1) }
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="create-dependecie_button"
          onClick={() => history.push('/change-password')}
        >
          Cambiar contraseña
        </Button>
      </Box>
    </StyledVerifyEmail>
  )
}

export default VerifyEmail
