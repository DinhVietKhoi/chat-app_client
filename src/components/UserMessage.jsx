import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import checkActive from '../helpers/checkAtive'
import axios from 'axios'
import { getLastMsgRouter } from '../utils/APIRouter'
import timeAgo from '../helpers/timeAgo'
import getTime from '../helpers/getTime'
function UserMessage({ socket, currentUser, onlineUsers, fr, HandleUserSelected, mode, userSelected,handleNewMsg }) {
    const [lastMsg, setLastMsg] = useState(undefined)
    const [time,setTime] = useState(undefined)
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(getLastMsgRouter, {
                    params: {
                    senderId: currentUser._id,
                    receiverId: fr._id,
                },
            });
                setLastMsg(res.data)
                setTime(res.data.createdAt)

            }
            catch (err) {
                console.log(err)
            }
        }
        if (currentUser && fr) {
            fetch()
        }
    }, [currentUser, fr])
    useEffect(() => {
        if (socket) {
            socket.on('new-msg', (newMessage) => {
                handleNewMsg(newMessage)
                const check1 = newMessage.users.filter(e => e == fr._id) 
                const check2 = newMessage.users.filter(e => e == currentUser._id)
                if (check1.length>0 && check2.length>0) {
                    setLastMsg(newMessage)
                    setTime(newMessage.createdAt)
                }
            })
        }
    }, [socket]);
    return (
        <Container style={time&&{order: -getTime(time)}}>
            <div className={`container ${mode}`} onClick={()=>HandleUserSelected(fr)}>
                <div className='body-box'>
                    <div className='avatar'>
                        <img src={fr.avatarImage} alt=''></img>
                        <span className={`dot ${checkActive(onlineUsers,fr._id)}`}></span>
                    </div>
                    <div className='content'>
                        <span className='name'>{fr.fullname}</span>
                        <p className='mess'>{lastMsg&&lastMsg.message.text}</p>
                    </div>
                </div>
                
                <div className='time'>
                    <span>{lastMsg&&timeAgo(lastMsg.createdAt)}</span>
                </div>
            </div>
        </Container>
    )
}
const Container = styled.div`
    width: 100%;
    opacity:0;
    animation: showComponent .1s .125s ease forwards;
    .container{
        padding:1rem;
        display: flex;
        justify-content: space-between;
        transition: 0.125s ease-in-out;
        gap:1rem;
        cursor: pointer;
        background-color: #f0f3f9;
        border-radius: .5rem;
        &.true{
            background-color: #36404A;
            .mess{
                color:#ffffff !important;
            }
            &:hover{
                background-color: #414549;
            }
        }
        &:hover{
            background-color: #E6EBF5;
        }
        .body-box{
            display: flex;
            gap: 1rem;
            flex:1;
            width: 100%;
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
            justify-content: space-around;
            width: 100%;
            overflow: hidden;
            font-weight: 600;
            .mess{
                max-width: 15rem;
                color:#939498;
                white-space: nowrap; 
                overflow: hidden;    
                text-overflow: ellipsis;
                padding-right: 10px;
                font-size: 1rem;
                font-weight: 500;
                color:#000000;
            }
        }
        .time{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            color:#939498;
            font-size: 1.2rem;
            padding-left: auto;
        }
    }
    @keyframes showComponent{
        0%{
            opacity: 0;
            visibility: hidden;
        }
        100%{
            opacity: 1;
            visibility: visible;
        }
    }
    @media screen and (max-width:400px) {
        
        .time{
            display: none !important;
        }
    }
    @media screen and (max-width:320px) {
        .name,.mess{
            max-width: 100% !important;
            width: 100% !important;
            white-space: nowrap !important; 
            overflow: hidden !important;    
            text-overflow: ellipsis !important;
        }
    }
`
export default UserMessage