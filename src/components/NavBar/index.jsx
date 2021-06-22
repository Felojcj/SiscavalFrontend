import React from 'react';
import styled from 'styled-components';
import { NavLink } from "react-router-dom";

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

  & a.active {
    color: #E2C346;
  }
`;

const index = () => {
  return (
    <StyledNavBar>
      <NavLink to="/dependencies" activeClassName="active">Dependencias</NavLink>
      <NavLink to="/users" activeClassName="active">Usuarios</NavLink>
      <NavLink to="/templates" activeClassName="active">Plantillas</NavLink>
      <NavLink to="/schedules" activeClassName="active">Programacion</NavLink>
      <NavLink to="/sie" activeClassName="active">SIE</NavLink>
    </StyledNavBar>
  );
};

export default index;