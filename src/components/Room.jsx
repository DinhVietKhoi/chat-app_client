import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { TbArrowsJoin } from "react-icons/tb";
import { TbMessages } from "react-icons/tb";

function Room({ mode, HandleUserSelected, socket, currentUser,onlineGroup }) {
    const [statusPublic, setStatusPublic] = useState(false)
    const [statusPrivate, setStatusPrivate] = useState(false)
    const handleGroupSize = (a) => {
        a==='public'?setStatusPublic(!statusPublic):setStatusPrivate(!statusPrivate)
    }
    const handleJoin = () => {
        HandleUserSelected('group')
        socket.emit('add-user-group',currentUser._id)
    }
    return (
        <Container>
            <div className={`container ${mode}`}>
                <div className='header'>
                    <div className='header-group'>
                        <h1><TbArrowsJoin />Room Chat <TbArrowsJoin /></h1>
                    </div>
                </div>
                <div className='body'>
                    <div className={`public group ${statusPublic}`}>
                        <div className='title' onClick={()=>handleGroupSize('public')}>
                            <div className='title-group'>
                                <HiOutlineUserGroup />
                                <h3>Community Group Chats</h3>
                                <p>{onlineGroup?onlineGroup.length:0} <FaRegUser /></p>
                            </div>
                            {
                                statusPublic?<FaCaretUp />:<FaCaretDown />
                            }
                            
                        </div>
                        <div className='group-item' onClick={handleJoin}>
                            <span><TbMessages />Join</span>
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
    .container{
        height: 100vh;
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
        &.true .group-item{
            border: .1rem solid #ffffff;
            background-color: #36404A;
            box-shadow: 0rem 0rem .2rem #fff;
            span{
                color:#ffffff;

            }
        }
    }
    .header{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 2rem;
        &-group{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        svg{
            font-size: 2.5rem;
            cursor: pointer;
            &:hover{
                color: #ecc5e7;
            }
        }
        h1{
            align-self: flex-start;
            font-size: 2rem;
            color:#ec68d8;
            display: flex;
            gap:.5rem;
            align-items: center;
            svg:first-child{
                transform: rotate(180deg);
                font-size: 2rem;
            }
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
    }
    .body{
        width: 100%;
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
        h3{
            font-weight: 500;
        }
        .group{
            padding:1rem;
            border: .2rem solid #f3e0f1;
            border-radius: .5rem;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            overflow: hidden;
            gap: 1rem;
            &:nth-child(1){
                margin-bottom: 2rem;
            }
            &.true{
                    max-height: 5rem;
                    min-height: 4rem;
                }
            &-item{
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 1rem 2rem;
                transition: .05s ease-in-out;
                cursor: pointer;
                border-radius: 1rem;
                background-color: #f0f3f9;
                border: .1rem solid #000000;
                justify-content: center;
                box-shadow: 0rem 0rem .2rem #000;
                & span{
                    color:#343a40;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    font-size: 1.6rem;
                    svg{
                        margin-right: .3rem;
                        font-weight: 600;
                        font-size: 1.6rem;
                    }
                }
                &:hover{
                    background-color: #f1cfec;
                    span{
                        color:#ffffff;
                        color:#ec68d8;
                    }
                }
                &.nogroup{
                    align-items: center;
                    span{
                        width: 100%;
                        text-align: center;
                    }   
                }
                
            }
            .title{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 2rem;
                margin-bottom: 1rem;
                cursor: pointer;
                p{
                    align-self: flex-end;
                    font-weight: 600;
                    color:#ec68d8;
                    font-size: 1.3rem;
                    display: flex;
                    margin-left: auto;
                    align-items: center;
                    svg{
                        margin-left: .3rem;
                        font-weight: 600;
                    }
                }
                &-group{
                    display: flex;
                    align-items: center;
                    flex:1;
                    svg{
                        margin-right: 1rem;
                    }
                    h3{
                        font-size: 1.5rem;
                        font-weight: 500;
                    }
                }
            }
        }
    }
    @media screen and (max-width:400px) {
        .title{
            &-group{
                width: 100%;
                svg{
                    display: none;
                }
                p{
                    svg{
                        display: block;
                    }
                }
            }
        }
    }
    @media screen and (max-width:320px) {
        .title{
            &-group{
                h3{
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
export default Room