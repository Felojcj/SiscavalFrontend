import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledNavBar = styled.nav`
  width: 48%;
  display: flex;
  justify-content: space-evenly;

  & a {
    color: white;
  }

  & a::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: #E2C346;
    transition: width .4s;
  }

  & a:hover::after {
    width: 100%;
  }
`;

const index = () => {
  return (
    <StyledNavBar>
      <Link to="/dependencias">Dependencias</Link>
      <Link to="/usuarios">Usuarios</Link>
      <Link to="/plantillas">Plantillas</Link>
    </StyledNavBar>
  );
};

export default index;