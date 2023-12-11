import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RiUser5Line } from "react-icons/ri";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import axios from 'axios';
import { getUserRouter } from '../utils/APIRouter';
import timeAgo from '../helpers/timeAgo';
import { GrClose } from 'react-icons/gr';
import checkActive from '../helpers/checkAtive';
import cat from '../assets/cat.jpg'
import UserItem from './UserItem';

function ProfileUser({currentUser,listUser,onlineGroup, HandleUserSelected, userSelected, handleShowProfile, mode,onlineUsers }) {
    const [user,setUser] = useState(undefined)
    const [statusAbout, setStatusAbout] = useState('down')
    const [listUserRoom,setListUserRoom] = useState(undefined)
    const handleAbout = () => {
        statusAbout === 'up' ? setStatusAbout('down') : setStatusAbout('up')
    }
    useEffect(() => {
        if (userSelected) {
            if (userSelected !== 'group') {
                const fetchData = async () => {
                    try {
                        const res = await axios.get(getUserRouter,{params: { id: userSelected._id }})
                        setUser(res.data)
                    }
                    catch(err) {
                        console.log(err)
                    }
                }
                fetchData()
            }
            else {
                setUser(true)
            }
        }
    }, [userSelected])
    useEffect(() => {
        if (onlineGroup && listUser) {
            const l = listUser.filter(e => {
                return onlineGroup.includes(e._id)
            })
            setListUserRoom(l)
        }
    },[onlineGroup,listUser])
    return (
        <Container>
            {
                user&&<div className={`container ${mode}`}>
                <div className='header'>
                    <div className='header-group'>
                            <h1 onClick={handleShowProfile}>
                                <GrClose />
                            </h1>
                        <div className='avatar'>
                            <img
                                src={userSelected!=='group'?user.avatarImage:cat}
                                alt="">
                                </img>
                        </div>
                        <span>{userSelected!=='group'?user.fullname:"Community Group Chats"}</span>
                        <div className={`status ${userSelected!=='group'?checkActive(onlineUsers, userSelected._id):true}`}>
                            <span className='dot'></span>
                            <span>{userSelected!=='group'?(checkActive(onlineUsers, userSelected._id) ? 'Active' : 'Busy'):'Active'}</span>
                            </div>
                    </div>
                </div>
                <div className='note'>
                        {userSelected!=='group'?(user.about == "" ? <p>Chưa có thông tin</p> : <p>{user.about}</p>):<p className='room-note'>--Nhóm chat tổng.--</p>}
                </div>
                    <div className='body'>
                        {
                            userSelected !== 'group' ?
                                <div className={`about ${statusAbout}`}>
                                    <div className='title' onClick={handleAbout}>
                                        <div className='title-group'>
                                            <RiUser5Line />
                                            <h3>About</h3>
                                        </div>
                                        {
                                            statusAbout==='up'?<FaCaretUp />:<FaCaretDown />
                                        }
                                        
                                    </div>
                                    <div className='about-group'>
                                        <span>Email</span>
                                        <p>{user.email }</p>
                                    </div>
                                    <div className='about-group'>
                                        <span>Name</span>
                                        <p>{user.fullname}</p>
                                    </div>
                                    <div className='about-group'>
                                        <span>Locaiton</span>
                                        <p>{user.address }</p>
                                    </div>
                                    <div className='about-group'>
                                        <span>Joining Date</span>
                                        <p>{timeAgo(user.createdAt)}</p>
                                    </div>
                                </div>
                                :
                                <div className='list-user-room'>
                                    <h3>Thành viên đang tham gia:</h3>
                                    {
                                        currentUser&&<div className={`current-user-profile ${mode}`}>
                                            <div className='body-box'>
                                                <div className='avatar'>
                                                    <img src={currentUser.avatarImage} alt=''></img>
                                                    <span className={`dot true`}></span>
                                                </div>
                                                <div className='content'>
                                                    <span className='name'>{currentUser.fullname}(bạn)</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                        
                                    {
                                        listUserRoom && listUserRoom.map(e => {
                                            return <UserItem key={e._id} onlineUsers={onlineUsers}  user={e}  HandleUserSelected={HandleUserSelected} mode={mode}></UserItem>
                                        })
                                    }
                                </div>
                        }
                </div>
            </div>
            }
            
        </Container>
    )
}
const Container = styled.div`
    width: 38rem;
    height: 100%;
    background-color: #ffffff;
    position: relative;
    z-index: 1;
    &>.container{
        box-shadow: 0.1rem 0.2rem rgba(236, 104, 216,.4);
        height: 100vh;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        overflow-y: scroll;
        padding: 1rem;
        padding-right: 1rem;
        border-left: .2rem solid #000000;
        &.true{
            background-color: #303841;
            color: #ffffff;
            border-left: .2rem solid #ffffff;
            .header svg{
                color:#ffffff;
                &:hover{
                color: #ec68d8;
                }
            }
        }
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
        .room-note{
            text-align: center;
            width: 100%;
            padding-bottom: 1rem;
            border-bottom: .1rem solid rgb(237,238,246);

        }
        .list-user-room{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap:1rem;
            h3{
                font-weight: 500;

            }
            .current-user-profile{
                width: 100%;
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
        }
    }
    .header{
        width: 100%;
        &-group{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-bottom: .1rem solid rgb(237,238,246);
        }
        h1{
            align-self: flex-start;
            font-size: 2rem;
            color:#ec68d8;
            display: flex;
            align-items: center;
            gap:.5rem;
            svg{
                cursor: pointer;
                font-size: 2rem;
                color: #36404A;
                background-color: transparent;
                &:hover{
                    color:#ec68d8;
                }
            }
        }
        .avatar{
            margin-bottom: 2rem;
            img{
                height: 10rem;
                width: 10rem;
                border-radius: 50%;
                border: .1rem solid #ecc5e7;
                padding: 0.5rem;
            }
        }
        span{
            font-size: 1.6rem;
            font-weight: 500;
            margin-bottom: .5rem;
        }
        .status{
            display: flex;
            align-items: center;
            gap: .5rem;
            &.true .dot{
                background-color: #06D6A6;
            }
            &.true span{
                color: #06D6A6;
            }
            span{
                color:#d60606;
            }
            .dot{
                width: .8rem;
                height: .8rem;
                    background-color: #d60606;
                border-radius: 50%;
                display: block;
            }
        }
    }
    .note{
        width: 100%;
        padding: 2rem 0;
        font-weight: 500;
        color: #ec68d8;
        display: flex;
        gap:1rem;
        justify-content: space-between;
        position: relative;
        p{
            max-width: 100%;
            word-wrap: break-word; 
        }
    }
    .body{
        width: 100%;
        .about{
            padding:1rem;
            border: .2rem solid #f3e0f1;
            border-radius: .5rem;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            overflow: hidden;
            gap:2rem;
            &.up{
                    max-height: 5rem;
                    min-height: 4rem;
                }
            .title{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 2rem;
                cursor: pointer;
                
                &-group{
                    display: flex;
                    display: flex;
                    align-items: center;
                    svg{
                        margin-right: 1rem;
                    }
                    h3{
                        font-size: 1.5rem;
                        font-weight: 500;
                    }
                }
            }
            .about-group{
                width: 100%;
                display: flex;
                flex-direction: column;
                gap:.5rem;
                font-weight: 500;
                span:first-child{
                    font-weight: 500;
                    color:#a3a4a4;
                }
            }
        }
    }
    @media screen and (max-width: 990px){
        width: 100vw;
    }
`
export default ProfileUser