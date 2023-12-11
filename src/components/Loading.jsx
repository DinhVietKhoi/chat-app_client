import React from 'react'
import styled from 'styled-components'
import loading from '../assets/loading.gif'
function Loading() {
  return (
      <Container>
          <img src={loading} alt=""></img>
    </Container>
  )
}
const Container = styled.div`
width: 100vw;
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
background-color: #ec68d8;
img{
    width: 400px;
    height: 400px;
}
`
export default Loading