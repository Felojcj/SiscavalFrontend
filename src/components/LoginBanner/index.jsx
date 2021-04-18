import React from 'react'
import styled from 'styled-components'

import loginImg from '../../assets/loginpoli.jpg'

const StyledLoginSection = styled.section`
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${loginImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;

  & h1 {
    color: #FFC400;
  }

  @media (min-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const LoginBanner = () => {
  return (
    <StyledLoginSection>
      <h1>SISCAVAL</h1>
    </StyledLoginSection>
  )
}

export default LoginBanner
