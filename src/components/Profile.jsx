import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FaDotCircle } from "react-icons/fa";
import { RiUser5Line } from "react-icons/ri";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import timeCurrent from '../helpers/getTime';
import { TbArrowsJoin } from "react-icons/tb";
import { CiEdit } from 'react-icons/ci';
import axios from 'axios';
import { setProfileRouter } from '../utils/APIRouter';
import timeAgo from '../helpers/timeAgo';
function Profile({ currentUser,handleCurrentUser,mode }) {
    const inputAbout = useRef(null)
    const [editAbout, setEditAbout] = useState(false)
    const [valueAbout, setValueAbout] = useState(currentUser&&currentUser ? currentUser.about : '')
    const handleValueAbout = (e) => {
        setValueAbout(e.target.value)
    }
    const handleEditAbout = async() => {
        setEditAbout(!editAbout)
        if (editAbout) {
            const res = await axios.post(`${setProfileRouter}/${currentUser._id}`, { about: valueAbout })
            handleCurrentUser(res.data.user)
            setValueAbout(res.data.user.about)
        }
    }
    const [statusAbout, setStatusAbout] = useState('down')
    const handleAbout = () => {
        statusAbout === 'up' ? setStatusAbout('down') : setStatusAbout('up')
    }
    return (
        <Container>
            <div className={`container ${mode}`}>
                <div className='header'>
                    <div className='header-group'>
                    <h1><TbArrowsJoin />Profile <TbArrowsJoin /></h1>
                        <div className='avatar'>
                            <img
                                src={currentUser.avatarImage}
                                alt="">
                                </img>
                        </div>
                        <span>{currentUser.fullname}</span>
                        <div className={`dot ${ currentUser.status?'active':'busy'}`}>
                            <FaDotCircle />
                            <span>{ currentUser.status?'Ative':'Busy'}</span>
                        </div>
                    </div>
                </div>
                <div className='note'>
                    {
                        editAbout ? <input maxLength={50} ref={inputAbout} value={valueAbout} onChange={(e)=>handleValueAbout(e)}></input> :
                            (valueAbout == ""
                                ? <p>Hãy viết gì đó về bạn!</p>
                                : <p>{valueAbout}</p>)
                    }
                    <div className={`edit ${editAbout}`} onClick={handleEditAbout}>
                            <CiEdit />
                            <span>{editAbout?'Save':'Edit'}</span>
                        </div>
                </div>
                <div className='body'>
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
                            <span>Name</span>
                            <p>{currentUser.fullname}</p>
                        </div>
                        <div className='about-group'>
                            <span>Email</span>
                            <p>{currentUser.email }</p>
                        </div>
                        <div className='about-group'>
                            <span>Joining Date</span>
                            <p>{timeAgo(currentUser.createdAt)}</p>
                        </div>
                        <div className='about-group'>
                            <span>Locaiton</span>
                            <p>{currentUser.address }</p>
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
        overflow-y: scroll;
        padding-right: 1rem;
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
    .header{
        width: 100%;
        &-group{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-bottom: .1rem solid rgb(237,238,246);
            padding-bottom: 3rem;
        }
        h1{
            align-self: flex-start;
            font-size: 2rem;
            color:#ec68d8;
            display: flex;
            align-items: center;
            gap:.5rem;
            svg:first-child{
                font-size: 2rem;
                transform: rotate(180deg);
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
        .dot{
            font-size: .6rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap:.2rem;
            color: #06D6A6;
            &.true{
                color:#06D6A6;
            }
            &.false{
                color:#d60606;
            }
            svg{
            }
            span{
                font-size: 1.2rem;
                font-weight: 500;
                margin: 0;
            }
        }
    }
    .note{
        width: 100%;
        padding: 3rem 0;
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
        input{
            width: 100%;
            padding:1rem 2rem;
            outline: none;
            border: none;
            border-bottom: .1rem solid #ec68d8;
            background-color: transparent;
            color: #ec68d8;
        }
        &:hover > .edit{
                opacity: 1;
                visibility: visible;
            }
        .edit{
            color:#a3a4a4;
            display: flex;
            gap:.5rem;
            align-items: center;
            position: absolute;
            top:0;
            right:0;
            padding:1rem;
            border-radius: .5rem;
            transition: .125s linear;
            &:hover{
                cursor: pointer;
                color: #ec68d8;
            }
            &.true{
                opacity: 1;
                visibility: visible;
                color: #ec68d8;
            }
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
`
export default Profile