import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import React, { useContext } from 'react'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Button from '@material-ui/core/Button';

import { AuthContext } from '../../contexts/AuthContext'

const StyledLogOut = styled.nav`
  display: flex;
  justify-content: space-evenly;

  & button {
    background-color: #32A457;
    color: white;
    padding: 5px;
    border: none;
    border-radius: 3px;
    box-shadow: 3px 3px 5px -1px rgb(0 0 0 / 30%);
    font-weight: 400;
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

  const loginLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <StyledLogOut>
      <Button 
        onClick={() => loginLogout()}
        variant="contained"
        color="primary"
        endIcon={<MeetingRoomIcon />}
      >
        Cerrar Sesión
      </Button>
    </StyledLogOut>
  );
};

export default LogOut;