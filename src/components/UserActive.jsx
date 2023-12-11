import React from 'react'
import styled from 'styled-components'

function UserActive({ user, HandleUserSelected,mode }) {
  return (
    <Container>
        <div className={`container ${mode}`} onClick={()=>HandleUserSelected(user)}>
            <div className='avatar'>
                <img src={user.avatarImage} alt=''></img>
                <span></span>
            </div>
            <span className='name'>{user.fullname}</span>
        </div>
    </Container>
  )
}
const Container = styled.div`
    .container{
        cursor: pointer;
        color:#ec68d8;
        background-color: #d9dadc;
        
        &.true{
            background-color: #36404A;
        }
        .name{
            font-weight: 500;
            margin-bottom: .5rem;
            box-sizing: content-box;
            white-space: nowrap; 
            overflow: hidden;    
            text-overflow: ellipsis;
            width: 100%;
            text-align: center;
            font-size: 1.2rem;
        }
        .avatar{
            position: relative;
            top:-3rem;
            width: 4rem;
            height: 1rem;
            margin-bottom: .5rem;
            img{
                border-radius: 50%;
                width: 4rem;
                height: 4rem;
                position: absolute;
                top:0;
                left:0;
                border: 1px solid #ec68d8;
            }
            span{
                border-radius: 50%;
                position: absolute;
                width: 1rem;
                height: 1rem;
                background-color: #06D6A6;
                border: 1px solid #ffffff;
                right:0;
                bottom:-3rem;
            }
        }
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        flex-direction: column;
        padding: 1rem 1rem;
    }
`
export default UserActive