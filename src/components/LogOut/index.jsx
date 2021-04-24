import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const StyledLogOut = styled.nav`
  width: 50%;
  display: flex;
  justify-content: space-evenly;

  & button {
    background-color: #32A457;
    color: white;
    padding: 8px;
    border: none;
    border-radius: 3px;
    box-shadow: 3px 3px 5px -1px rgb(0 0 0 / 30%);
    font-weight: 400;
  }

  @media (min-width: 1024px) {
    width: 20%;
    font-weight: 500;
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
      <button onClick={() => loginLogout()}>Cerrar Sesión</button>
    </StyledLogOut>
  );
};

export default LogOut;