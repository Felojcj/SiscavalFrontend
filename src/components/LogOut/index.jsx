import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import React, { useContext, useState } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { AuthContext } from '../../contexts/AuthContext'

const StyledLogOut = styled.nav`
  display: flex;
  justify-content: space-evenly;

  & button {
    color: white;
    text-transform: none;
  }

  @media (min-width: 1024px) {
    font-weight: 500;
  }

  & button:hover {
    background-color: #196844;
  }
`;

const LogOut = () => {
  const { logout } = useContext(AuthContext)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const loginLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <StyledLogOut>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<AccountCircleIcon />}
      >
        {JSON.parse(localStorage.getItem('loginInfo')).name}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical:'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
      >
        <MenuItem>Recuperar Contraseña</MenuItem>
        <MenuItem onClick={() => loginLogout()}>Cerrar Sesión</MenuItem>
      </Menu>
    </StyledLogOut>
  );
};

export default LogOut;