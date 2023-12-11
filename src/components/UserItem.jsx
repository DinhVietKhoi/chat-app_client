import React from 'react'
import styled from 'styled-components'
import checkActive from '../helpers/checkAtive'

function UserItem({ onlineUsers, user, HandleUserSelected, mode }) {
    return (
        <Container onClick={()=>HandleUserSelected(user)}>
            <div className={`container ${mode}`} onClick={()=>HandleUserSelected(user)}>
                <div className='body-box'>
                    <div className='avatar'>
                        <img src={user.avatarImage} alt=''></img>
                        <span className={`dot ${checkActive(onlineUsers,user._id)}`}></span>
                    </div>
                    <div className='content'>
                        <span className='name'>{user.fullname}</span>
                    </div>
                </div>
            </div>
    </Container>
    )
}
const Container = styled.div`
    width: 100%;
    .container{
        padding:1rem;
        display: flex;
        justify-content: space-between;
        transition: 0.125s ease-in-out;
        gap:1rem;
        cursor: pointer;
        border-radius: .5rem;
        background-color: #E6EBF5;
        &.true {
            background-color: #36404A;
            &:hover{
            background-color: #414549;

            }
        }
        &:hover{
            background-color: #E6EBF5;
        }
        .body-box{
            width: 100%;
            display: flex;
            gap: 1rem;
        }
        .avatar{
            position: relative;
            img{
                border-radius: 50%;
                width: 4rem;
                border: 1px solid #ec68d8;
                height: 4rem;
            }
            .dot{
                border-radius: 50%;
                position: absolute;
                width: 1rem;
                height: 1rem;
                border: 1px solid #ffffff;
                right:.2rem;
                bottom:.3rem;
                &.true{
                    background-color: #06D6A6;
                }
                &.false{
                    background-color: #d60606;
                }
            }
        }
        .content{
            
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            overflow: hidden;
            span{
                font-weight: 500;
            }
            .mess{
                max-width: 15rem;
                color:#939498;
                white-space: nowrap; 
                overflow: hidden;    
                text-overflow: ellipsis;
                padding-right: 10px;
            }
        }
        .time{
            color:#939498;
        }
    }

`
export default UserItem