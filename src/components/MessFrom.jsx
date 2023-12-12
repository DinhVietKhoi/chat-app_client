import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaRegClock } from "react-icons/fa6";
import convertDate from '../helpers/convertDate';
import timeAgo from '../helpers/timeAgo'
function MessFrom({ mess }) {
    const [formattedTime, setFormattedTime] = useState(timeAgo(mess.createdAt));
    useEffect(() => {
        const intervalId = setInterval(() => {
        setFormattedTime(timeAgo(mess.createdAt));
        }, 60000); 
    return () => clearInterval(intervalId);
    }, []);
return (
    <Container>
        <div className='container'>
            <div className='content'>
                <div className='text'>
                    <p>{mess.message.text}</p>
                    <div className='time'><FaRegClock /><span>{formattedTime}</span></div>
                </div>
                <span className='name'>{mess.sender.fullname}</span>
            </div>
            <div className='avatar'>
                <img src={mess.sender.avatarImage} alt=""></img>
            </div>
        </div>
</Container>
)
}
const Container = styled.div`
    align-self: flex-end;
    width: 80%;
    display: flex;
    justify-content: flex-end;
    .container{
        display: flex;
        flex-direction: row;
        gap: 1rem;
        width: 100%;
        .content{
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex:1;
            .text{
                display: flex;
                flex-direction: column;
                gap:1rem;
                padding: 2rem;
                color:#ffffff;
                background-color: #EC68D8;
                border-radius: 1rem;
                font-size: 1.5rem;
                font-weight: 500;
                position: relative;
                margin-bottom: 2rem;
                &::after{
                    content: '';
                    position: absolute;
                    bottom:-1rem;
                    right:0;
                    border-top: 1rem solid #EC68D8;
                    border-bottom: 1rem solid transparent;
                    border-left: 1rem solid transparent;
                    border-right: 1rem solid #EC68D8;
                }
                p{
                    word-wrap: break-word;
                }
            }
            .time{
                display: flex;
                align-items: center;
                font-size: 1.2rem;
                font-weight: 400;
                gap:.2rem;
                color:#fff;
                span{
                    flex:1;
                }
            }
            .name{
                align-self: flex-end;
                font-weight: 600;
                font-size:1.4rem;
            }
            
        }
        .avatar{
                align-self: flex-end;
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
export default MessFrom