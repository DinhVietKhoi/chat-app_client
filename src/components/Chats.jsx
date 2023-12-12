import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import UserActive from './UserActive';
import { MdOutlineRecentActors } from "react-icons/md";
import { TbArrowsJoin } from "react-icons/tb";

import { Swiper, SwiperSlide} from 'swiper/react';
import UserMessage from './UserMessage';
import { listfriendRouter } from '../utils/APIRouter';
import axios from 'axios';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

function Chats({
    socket,
    listUser,
    HandleUserSelected,
    currentUser,
    onlineUsers,
    listFriend,
    handleListFriend,
    mode,
    userSelected,
    handleNewMsg
}) {
    const [statusPending, setStatusPending] = useState(false)
    const handlePending = () => {
        setStatusPending(!statusPending)

    }
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${listfriendRouter}/${currentUser._id}`)
                handleListFriend(res.data)
            }
            catch (err) {
                console.log(err)
            }
            
        }
        fetch()
    }, [])
    return (
        <Container>
            <div className={`container ${mode}`}>
                <div className='header'>
                    <h1><TbArrowsJoin />Chats <TbArrowsJoin /></h1>
                    <div className='userActive'>
                        <Swiper
                            spaceBetween={20}
                            breakpoints={{
                                990: {
                                    slidesPerView: 4,
                                },
                                800: {
                                    slidesPerView: 7,
                                },
                                650: {
                                    slidesPerView: 6,
                                },
                                550: {
                                    slidesPerView: 5,
                                },
                                460: {
                                    slidesPerView: 4,
                                },
                                350: {
                                    slidesPerView: 3,
                                },
                                220: {
                                    slidesPerView: 2,
                                },
                                0: {
                                    slidesPerView: 1,
                                }
                            }}
                            className='swiper_container'
                        >
                            
                            {
                                onlineUsers && listUser.length>0 && onlineUsers.map(ol => [
                                    listUser.map(item => {
                                        return  ol == item._id &&<SwiperSlide key={item._id}>
                                            <UserActive mode={ mode} user={item} HandleUserSelected={HandleUserSelected} />
                                            </SwiperSlide>
                                        
                                    })
                                ])
                            }
                            {
                                onlineUsers && listUser.length>0 && onlineUsers.length ==1 &&<span className='no-online'>Không có người online.</span>
                            }
                        </Swiper>
                    </div>
                </div>
                <div className='body'>
                    <div className={`pending ${statusPending}`}>
                        <div className='pending-header' onClick={handlePending}>
                            <div className='gr'>
                            <MdOutlineRecentActors />
                                <h3>Message Requests {listFriend&&listFriend.listRequest && listFriend.listRequest.length > 0 && <span>({listFriend.listRequest.length})</span>}</h3>
                            </div>
                            {
                                !statusPending?<FaCaretUp />:<FaCaretDown />
                            }
                            </div>
                        <div className='pending-list'>
                            {
                                listFriend&&listFriend.listRequest && listFriend.listRequest.map(fr => [
                                    <UserMessage handleNewMsg={handleNewMsg} userSelected={userSelected} socket={socket} currentUser={currentUser} mode={mode} onlineUsers={onlineUsers} key={fr._id} fr={fr} HandleUserSelected={HandleUserSelected}></UserMessage>
                                ])
                            }
                            {
                                listFriend&&listFriend.listRequest && listFriend.listRequest.length === 0&&<span className='no-requests'>Không có tin nhắn chờ</span>
                            }
                            </div>
                    </div>
                    <div className='recent'>
                        <div className='recent-header'>
                            <div className='gr'>
                            <MdOutlineRecentActors />
                            <h3>Recent</h3>
                            </div>
                        </div>
                        <div className='recent-list'>
                            {
                                listFriend&&listFriend.listFriend && listFriend.listFriend.map(fr => [
                                    <UserMessage handleNewMsg={handleNewMsg} userSelected={userSelected} socket={socket} currentUser={currentUser} mode={mode} onlineUsers={onlineUsers} key={fr._id} fr={fr} HandleUserSelected={HandleUserSelected}></UserMessage>
                                ])
                            }
                            </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}
const Container = styled.div`
    width: 100%;
    height: 100%;
    &>.container{
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        &.true .search{
            background-color: #36404A;
            input{
                color:#ffffff;
            }
        }
    }
    .userActive{
        width: 100%;
        overflow: hidden;
        padding-top: 2rem;
        display: flex;
        .swiper_container{
            display: flex;
            width: 100%;
            flex:1;
            flex-direction: row;
            .swiper-wrapper{
                display: flex;
                flex-direction: row;
            }
        }
        .no-online{
            font-size: 1.2rem;
            color:#ec68d8;
        }
    }
    .header{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        flex-direction: column;
        width: 100%;
        margin-bottom: 2em;
        .swiper_container>.swiper-wrapper{
            display: flex;
        }
        .search{
            padding: 0 2rem;
            width: 100%;
            display: flex;
            align-items: center;
            background-color: #E6EBF5;
            border-radius: 1rem;
            svg{
                margin-right: 1rem;
                font-size: 2rem;
                color:#939498;
            }
            input{
                font-weight: 500;
                width: 100%;                
                padding:1.5rem 0;
                background-color: transparent;
                border: none;
                outline: none;
            }
        }
        h1{
            align-self: flex-start;
            font-size: 2rem;
            color:#ec68d8;
            display: flex;
            align-items: center;
            gap:.5rem;
            svg:first-child{
                transform: rotate(180deg);
            }
        }
    }
    & .body{
        flex:1;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        gap:2rem;
        
        .recent{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border-radius: 0.5rem;
            padding:.5rem;
            overflow: hidden;
            flex:1;
            height: 100%;

            h3{
                font-weight: 500;
                font-size: 1.5rem;
            }
            &-header{
                padding:1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                svg{
                    font-size: 2rem;
                    margin-right: .5rem;
                }
            }
            .gr{
                display:flex;
                align-items: center;
            }
            &-list{
                flex:1;
                height: 100%;
                display: flex;
                /* align-items: center; */
                flex-direction: column;
                gap:1rem;
                padding-right: 1rem;
                overflow-y: scroll;
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
            }
        }
        .pending{
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border: .1rem solid #f3e0f1;
            padding:.5rem;
            border-radius: 0.5rem;
            .no-requests{
                text-align: center;
                font-size: 1.2rem;
                color:#ec68d8;
            }
            &.false{
                gap:0;
                & .pending-list{
                    max-height: 0;
                    overflow: hidden;
                }
            }
            h3{
                font-weight: 500;
                font-size: 1.5rem;
                max-width: 100% !important;
                width: 100% !important;
                white-space: nowrap !important; 
                overflow: hidden !important;    
                text-overflow: ellipsis !important;
            }
            &-header{
                padding:1rem;
                display: flex;
                align-items: center;
                cursor: pointer;
                justify-content: space-between;
                gap: 1rem;
                h3{
                    display: flex;
                    align-items: center;
                    gap:1rem;
                }
                span{
                    font-size: 1.2rem;
                    color:#ec68d8;
                    font-weight: 600;
                }
                svg{
                    font-size: 2rem;
                    margin-right: .5rem;
                }
            }
            .gr{
                display:flex;
                align-items: center;
                overflow: hidden;
            }
            &-list{
                display: flex;
                /* align-items: center; */
                flex-direction: column;
                gap:1rem;
                padding-right: 1rem;
                overflow-y: scroll;
                height: 100%;
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
            }
        }
    }
    @media screen and (max-width:320px) {
        .pending-header{
            svg{
                display: none;
            }
        }
    }
`
export default Chats
