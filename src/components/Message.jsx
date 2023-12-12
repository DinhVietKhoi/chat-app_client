import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { addMsgRouter, getMsgRouter } from '../utils/APIRouter'
import { FaRegUser } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

import MessTo from './MessTo';
import MessFrom from './MessFrom';
import ProfileUser from './ProfileUser';
import axios from 'axios'
import InputMessage from './InputMessage';
import spin from '../assets/spin.gif'
import { TbMessageCirclePlus } from "react-icons/tb";
import clearAllTimeouts from '../helpers/clearAllTimeous';
import checkActive from '../helpers/checkAtive';
import { GrClose } from "react-icons/gr";
import cat from '../assets/cat.jpg'
function Message({listUser, onlineGroup,userSelected, currentUser, handleListFriend, listFriend, socket, onlineUsers, mode,HandleUserSelected }) {
    const toastOption = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    }
    const [isScroll, setIsScroll] = useState(true)
    const messagesEndRef = useRef(null);
    const [receiverMsg,setReceiverMsg] = useState(undefined)
    const [listMessage, setListMessage] = useState([])
    const [skip, setSkip] = useState(20);
    const handleCloseMessage = ()=>{
        HandleUserSelected(undefined)
        setIsLoading(false)
    }
    const handleAddMsg = async (text) => {
        if (socket) {
            try {
                let msg;
                if (userSelected !== 'group') {
                    msg = await axios.post(addMsgRouter, { sender: currentUser._id, receiver: userSelected._id, text,type: 'users' })
                    socket.emit('add-request', { id:msg.data.populateMessage.receiver._id,user:msg.data.populateMessage.sender })
                    let LF;
                    let LR;
                    let isLF;
                    let isLR;
                    if (listFriend.listRequest.length > 0) {
                        isLR = listFriend.listRequest.find(lr => lr._id === msg.data.populateMessage.receiver._id)
                    }
                    if (listFriend.listFriend.length > 0) {
                        isLF = listFriend.listFriend.find(lr => lr._id === msg.data.populateMessage.receiver._id)
                    }
                    if (!isLF) {
                        LR = listFriend.listRequest
                        LF = [...listFriend.listFriend, msg.data.populateMessage.receiver]
                    }
                    if (isLR) {
                        const fakeLR = listFriend.listRequest.filter(lr => lr._id !== msg.data.populateMessage.receiver._id);
                        LR = fakeLR;
                        LF = [...listFriend.listFriend, msg.data.populateMessage.receiver]
                    }
                    if (!isLF || isLR) {
                        const listFR = { listFriend: LF ,listRequest: LR}
                        handleListFriend(listFR)
                    }
                }
                else {
                    msg = await axios.post(addMsgRouter, { sender: currentUser._id, receiver: currentUser._id, text,type: 'group' })
                }
                socket.emit('add-msg', msg)
                
            }
            catch (err) {
                
            }
        }
        else {
            toast.error('Có lỗi xảy ra vui lòng thử lại sau.', toastOption);
        }
        
    }
    const [showProfile, setShowProfile] = useState(false)
    const handleShowProfile = () => {
        setShowProfile(!showProfile)
    }
    const [isLoading,setIsLoading] = useState(false)
    const [isMessage,setIsMessage] = useState(true)
    useEffect(() => {
        userSelected !== undefined ? setIsLoading(true) : setIsLoading(false)
        
        setIsMessage(true)
    }, [userSelected])
    const [isEmoji, setIsEmoji] = useState(false)
    const emojiPickerRef = useRef(null);
    const emojiPickerBoxRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEmoji===true&&emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !emojiPickerBoxRef.current.contains(event.target) ) {
                setIsEmoji(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [emojiPickerRef, isEmoji]);
    useEffect(() => {
        setListMessage([])
        setSkip(20)
        let timeOutIsMsg;
        if (currentUser !== undefined && userSelected !== undefined) {
            const fetchData = async () => {
                try {
                    let response
                    if (userSelected !== 'group') {
                        response = await axios.get(getMsgRouter, { params: { sender: currentUser._id, receiver: userSelected._id, skip: 0, type: 'users' } });
                    }
                    else {
                        response = await axios.get(getMsgRouter, { params: { sender: currentUser._id, skip: 0, type: 'group' } });
                    }
                    setIsScroll(true)
                    setListMessage(response.data)
                }
                catch (err) {
                }
                timeOutIsMsg = setTimeout(() => {
                    setIsMessage(false)
                }, 500)
                
            }
            fetchData()
        }
        return () => {
            clearTimeout(timeOutIsMsg)
        }
    }, [currentUser, userSelected])
    const [isLoadMore,setIsLoadMore] = useState(false)
    const handleGetMsg = () => {
        if (!isLoadMore) {
            setIsLoadMore(true)
            let timeOutIsMsg;
            let timeOutIsLoadMore;
            if (currentUser !== undefined && userSelected !== undefined) {
                const fetchData = async () => {
                    try {
                        let response
                        if (userSelected !== 'group') {
                            response = await axios.get(getMsgRouter, { params: { sender: currentUser._id, receiver: userSelected._id, skip: skip, type: 'users' } });
                        }
                        else {
                            response = await axios.get(getMsgRouter, { params: { sender: currentUser._id, skip:skip, type: 'group' } });
                        }
                        setIsScroll(false)
                        setListMessage((pre)=>[...response.data,...pre])
                        setSkip(skip + listMessage.length)
                        timeOutIsLoadMore = setTimeout(() => {
                            setIsLoadMore(false)
                        }, 1000)
                        
                    }
                    catch (err) {
                    }
                    timeOutIsMsg = setTimeout(() => {
                        setIsMessage(false)
                    }, 500)
                    
                }
                fetchData()
            }
            return () => {
                clearAllTimeouts(timeOutIsMsg, timeOutIsLoadMore);
                
            }
        }
    }
    useEffect(() => {
        if (socket) {
            socket.on('new-msg', (newMessage) => {
                setReceiverMsg(newMessage)
            })
            return ()=>socket.off('new-msg')
        }
    }, [socket]);
    useEffect(() => {
        if (listMessage&&listMessage.length!==0&&isScroll) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [listMessage,isScroll])
    useEffect(() => {
        if (receiverMsg && isLoading) {
            if (userSelected !== 'group') {
                if ((receiverMsg.receiver._id === currentUser._id && receiverMsg.sender._id === userSelected._id) || (receiverMsg.sender._id === currentUser._id && receiverMsg.receiver._id === userSelected._id) && receiverMsg.type!=='group' ){
                    setIsScroll(true)
                    setListMessage((pre) => [...pre, receiverMsg])
                }
            }
            else {
                if (receiverMsg.type === 'group') {
                    setIsScroll(true)
                    setListMessage((pre) => [...pre, receiverMsg])   
                }
                
            }
        }
    }, [receiverMsg, isLoading, currentUser, userSelected])
    return (
        <Container>
            <ToastContainer />
            {
                isLoading ?
                    <>
                        <div className={`container ${mode}`}>
                            <div className='header'>
                                <div className='info' onClick={handleShowProfile}>
                                    <img src={userSelected!=='group'?userSelected.avatarImage:cat} alt=""></img>
                                        <span>{userSelected!=='group'?userSelected.fullname:"Community Group Chats"}</span>
                                    <span className={`dot ${userSelected!=='group'?checkActive(onlineUsers,userSelected._id):'true'}`}></span>
                                </div>
                                <div className='control'>
                                    <FaRegUser onClick={handleShowProfile}/>
                                    <GrClose onClick={handleCloseMessage} />
                                </div>
                            </div>
                            <div className={`body ${isMessage}`}>
                                {
                                    isMessage && <div className='loading-image'>
                                        <img src={spin} alt=""></img>
                                    </div>
                                }
                                {
                                    listMessage && (
                                        listMessage.length != 0?
                                        <div className='list-message'>
                                            <div className={`load-more ${isLoadMore}`} onClick={handleGetMsg} >
                                                {
                                                    isLoadMore?<img src={spin} alt=""></img>:<TbMessageCirclePlus />
                                                }
                                            </div>
                                            {
                                                listMessage&&listMessage.map(mess => {
                                                    return mess.sender._id === currentUser._id ? <MessFrom key={mess._id} mess={mess}></MessFrom> : <MessTo userSelected={userSelected} HandleUserSelected={HandleUserSelected} handleShowProfile={handleShowProfile} mode={mode} key={mess._id} mess={mess}></MessTo>
                                                })
                                            }
                                            <div ref={messagesEndRef}></div>
                                        </div>
                                        :
                                        <div className='message-null'>Hãy nhắn gì đó...</div>
                                    )
                                }
                            </div>
                            <div className='footer'>
                                <InputMessage handleAddMsg={handleAddMsg} mode={mode}></InputMessage>
                            </div>
                        </div>
                            <div className={`profile-user ${showProfile?'show':''}`}>
                            <ProfileUser currentUser={currentUser} listUser={listUser} HandleUserSelected={HandleUserSelected} onlineGroup={onlineGroup} mode={mode} onlineUsers={onlineUsers} userSelected={userSelected} handleShowProfile={handleShowProfile}></ProfileUser>
                            <div className='overlay' onClick={handleShowProfile}></div>
                        </div>
                    </>
                :
                    <div className={`not-data ${mode}`}>
                        No data.
                    </div>
            }
        </Container>
    )
}
const Container = styled.div`
    flex:7;
    height: 100vh;
    position: relative;
    .not-data{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color:#ec68d8;
        font-weight: 600;
        font-size: 1.6rem;
        background-color: #ffffff;
        &.true{
            background-color: #262E35;
        }
    }
    .profile-user{
            height: 100%;
            position: absolute;
            z-index: 10000;
            top:0;
            right: -38rem;
            transition:  0.125s ease;
            opacity: 0;
            visibility: hidden;
            .overlay{
                width: 100vw;
                height: 100vh;
                position: fixed;
                background-color: rgba(243, 194, 235, 0.4);
                top:0;
                left:0;
            }
            &.show{
                right: 0;
                opacity: 1;
                visibility: visible;
            }
        }
    &>.container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        &.true{
            background-color: #262E35;
            color:#ffffff;
            & .loading-image{
                background-color: #262E35 !important;
            }
        }
        .header{
            display:flex;
            align-items:center;
            justify-content: space-between;
            padding: 2rem;
            
            .info{
                cursor: pointer;
                display: flex;
                align-items: center;
                gap:1rem;
                overflow: hidden;
                img{
                    width: 4rem;
                    height: 4rem;
                    padding:.2rem;
                    border-radius: 50%;
                    border: 1px solid #ec68d8;
                }
                span{
                    font-size:1.6rem;
                    font-weight: 700;
                    color:#ec68d8;
                }
                .dot{
                    width: .8rem !important;
                    height: .8rem;
                    border-radius: 50%;
                    &.true{
                    background-color: #06D6A6;
                    }
                    &.false{
                        background-color: #d60606;
                    }
                }
            }
            .control{
                display: flex;
                gap:2rem;
                svg{
                    cursor: pointer;
                    font-size: 2rem;
                    &:hover{
                        color:#ec68d8;
                    }
                }
            }
        }
        .body{
            border-top: 1px solid #F0EFF5;
            flex:8;
            box-shadow: 0rem -0.1rem rgba(236, 104, 216,.4), 0rem .1rem rgba(236, 104, 216,.4);
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            &.true >  .list-message{
                opacity: 0;
                visibility: hidden;
            }
            .message-null{
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color:#ec68d8;
            }
            .list-message{
                flex:1;
                overflow-y: scroll;
                width: 100%;
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 2rem;
                gap:3rem;
                &::-webkit-scrollbar{
                    width: .4rem;
                    &-thumb{
                        background-color: #F1D4EC;
                        border-radius: 1rem;
                        &:hover{
                            background-color: #ec68d8;
                        }
                    }
                }
                .load-more{
                    background-color: #ec68d8;
                    
                    text-align: center;
                    padding: 1rem;
                    margin: -2rem;
                    cursor: pointer;
                    img{
                        width: 2rem;
                    }
                    svg{
                        width: 2rem;
                        font-weight: 600;
                        height: 2rem;
                        color:#ffffff;
                        
                    }
                    &.true{
                            pointer-events: none;
                            cursor: default;
                        }
                }
                
            }
            .loading-image{
                background-color: #ffffff;
                position: absolute;
                top:0;
                left:0;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                img{
                    width: 5rem;
                    height: 5rem;
                }
            }
        }
        .footer{
            padding:2rem;
        }
    }
    
    @media screen and (max-width: 990px){
        position: fixed;
        top:0;
        right:-100%;
        transition: all .125s ease;
        z-index: 2000;
        .not-data{
            position: fixed;
            z-index: 2000;
            top: 0;
            width: 100vw;
            right: -100%;
        }
        &>.container{
            position: fixed;
            right: 0;
            top: 0;
            width: 100vw;
            z-index: 2000;
        }
        .profile-user{
            position: fixed;
            top:0;
            right:0;
        }
        .overlay{
            display: none;
        }
    }
    @media screen and (max-width:400px) {
        &>.container{
            .info{
                span{
                    max-width: 50% !important;
                    width: 50% !important;
                    white-space: nowrap !important; 
                    overflow: hidden !important;    
                    text-overflow: ellipsis !important;
                }
            }
        }
    }
`
export default Message