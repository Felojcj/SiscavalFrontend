import React from 'react'
import styled from 'styled-components'

import LoginBanner from '../LoginBanner'
import LoginForm from '../LoginForm'

const StyledLogin = styled.main`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(1, 1fr);

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    // align-items: center;
  }
`

const LoginWrapper = () => {
  return (
    <StyledLogin>
      <LoginBanner />
      <LoginForm />
    </StyledLogin>
  )
}

export default LoginWrapper
