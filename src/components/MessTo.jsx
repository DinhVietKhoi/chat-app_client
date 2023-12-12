import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaRegClock } from "react-icons/fa6";
import timeAgo from '../helpers/timeAgo'
function MessTo({ mess, mode, handleShowProfile, userSelected, HandleUserSelected }) {
    const [formattedTime, setFormattedTime] = useState(timeAgo(mess.createdAt));
    const handleClickAvatar = () => {
        if (userSelected) {
            userSelected!=='group'?handleShowProfile():HandleUserSelected(mess.sender)
        }
        
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
        setFormattedTime(timeAgo(mess.createdAt));
        }, 60000); 
    return () => clearInterval(intervalId);
    }, []);
return (
    <Container>
        <div className={`container ${mode}`}>
        <div className='avatar' onClick={handleClickAvatar}>
                <img src={mess.sender.avatarImage} alt=""></img>
            </div>
            <div className='content'>
                <div className='text'>
                    <p>{mess.message.text}</p>
                    <div className='time'><FaRegClock /><span>{formattedTime}</span></div>
                </div>
                <span className='name'>{mess.sender.fullname}</span>
            </div>
            
        </div>
</Container>
    )
}
const Container = styled.div`
    align-self: flex-start;
    width: 80%;
    display: flex;
    justify-content: flex-start;
    .container{
        display: flex;
        flex-direction: row;
        gap: 1rem;
        &.true{
            & .text{
                background-color: #36404A !important;
                &::after{
                    content: '';
                    position: absolute;
                    bottom:-1rem;
                    left:0;
                    border-top: 1rem solid #36404A !important;
                    border-bottom: 1rem solid transparent;
                    border-left: 1rem solid #36404A !important;
                    border-right: 1rem solid transparent;
                }
            }
        }
        .content{
            display: flex;
            flex-direction: column;
            overflow: hidden;
            .text{
                display: flex;
                flex-direction: column;
                gap:1rem;
                padding: 2rem;
                background-color: #e7e7e7;
                border-radius: 1rem;
                font-size: 1.5rem;
                font-weight: 500;
                position: relative;
                margin-bottom: 2rem;
                p{
                    word-wrap: break-word;
                }
                &::after{
                    content: '';
                    position: absolute;
                    bottom:-1rem;
                    left:0;
                    border-top: 1rem solid #e7e7e7;
                    border-bottom: 1rem solid transparent;
                    border-left: 1rem solid #e7e7e7;
                    border-right: 1rem solid transparent;
                }
            }
            .time{
                align-self: flex-end;
                display: flex;
                align-items: center;
                font-size: 1.2rem;
                font-weight: 400;
                gap:.2rem;
                color:#7a7f9a;
            }
            .name{
                font-weight: 600;
                font-size:1.4rem;
            }
            
        }
        .avatar{
                align-self: flex-end;
                cursor: pointer;
                position: relative;
                top:1rem;
                img{
                    width: 4rem;
                    height: 4rem;
                    border-radius: 50%;
                    border: .1rem solid #ec68d8;
                }
            }
    }
    @media screen and (max-width:990px){
        &>.container{
            width: 100% !important;
            .content{
                flex:1;
            }
        }
    }
    @media screen and (max-width:300px){
        .time{
            svg{
                display: none;
            }
        }
    }
    @media screen and (max-width:250px){
        .time{
            display: none !important;
        }
    }
`
export default MessTo