import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Icon from '../../assets/icon-header.png';

const StyledIcon = styled.img`
  width: 142px;
  height: 42px;
`;

const index = () => {
  return (
    <Link to="/main">
      <StyledIcon src={Icon} alt="icono del header" />
    </Link>
  );
};

export default index;