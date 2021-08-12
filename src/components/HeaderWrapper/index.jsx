import React, { useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom'

import Icon from '../Icon';
import NavBar from '../NavBar';
import LogOut from '../LogOut';
import { AuthContext } from '../../contexts/AuthContext'

const StyledHeader = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #196844;

  & .header-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    & > * {
      padding: 1rem;
    }

    @media (min-width: 1024px) {
      flex-direction: row;
    }
    
    @media (min-width: 1440px) {
      width: 60%;
      margin: 0 auto;
    }
  }
`;

const HeaderWrapper = () => {
  const { logged } = useContext(AuthContext)
  const location = useLocation();

  return !!logged && !location.pathname.includes('/verify-email') ? (
    <StyledHeader>
      <div className="header-container">
        <Icon />
        <NavBar />
        <LogOut />
      </div>
    </StyledHeader>
  ) : null;
};

export default HeaderWrapper;