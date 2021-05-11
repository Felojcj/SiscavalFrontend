import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledNavBar = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  & a {
    color: white;
    padding: .3rem
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

  @media (min-width: 1024px) {
    width: 58%;
    justify-content: space-between;
    flex-wrap: no-wrap;
  }
`;

const index = () => {
  return (
    <StyledNavBar>
      <Link to="/dependencies">Dependencias</Link>
      <Link to="/users">Usuarios</Link>
      <Link to="/templates">Plantillas</Link>
      <Link to="/programacion">Programacion</Link>
    </StyledNavBar>
  );
};

export default index;