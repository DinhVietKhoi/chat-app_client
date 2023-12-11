import React from 'react'
import styled from 'styled-components'

function Avatar(url) {
    return (
        <Container>
            <div className='container'>
                <img src={url.src} alt=''></img>
            </div>
        </Container>
    )
}
const Container = styled.div`
    .container{
        img{
            width: 7rem;
            height: 7rem;
        }
    }
`
export default Avatar