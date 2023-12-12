import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import logo from '../assets/MeowChat.png'
import { FaRegUser } from "react-icons/fa";
import { RiMessage3Line, RiContactsLine } from "react-icons/ri";
import { TiGroupOutline } from "react-icons/ti";
import { MdOutlineSettings } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { CiLight, CiLogout } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { IoSettingsOutline } from "react-icons/io5";
import { Swiper, SwiperSlide} from 'swiper/react';

function Navbar({ menuSelected, handleMenuSelected, currentUser, mode, handleSetMode }) {
    const navigate = useNavigate();
    const [isSetting, setIsSetting] = useState(false)
    const [loadMode, setLoadMode] = useState(false)
    const handleLoadMode = () => {
        setLoadMode(true)
        handleSetMode()
        let time = setTimeout(() => {
        setLoadMode(false)
            
        }, 500);
        return () => clearTimeout(time)
    }
    
    const handleIsSetting = () => {
        setIsSetting(!isSetting)
        
    }
    const handleLogout = () => {
        localStorage.removeItem("chat-app-user");
        navigate('/login')
    }
    const settingRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSetting===true&&settingRef.current && !settingRef.current.contains(event.target) ) {
                setIsSetting(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [settingRef, isSetting]);
    return (
        <Container>
            <div className={`container ${mode}`}>
                <Link className='logo'>
                    <img src={logo} alt=""></img>
                </Link>
                <ul className={`nav pc active${menuSelected}`}>
                <li className={`true0 active${menuSelected}`} onClick={()=>handleMenuSelected(0)} tl='Profile'><FaRegUser /></li>
                <li className={`true1 active${menuSelected}`} onClick={()=>handleMenuSelected(1)} tl='Chats'><RiMessage3Line /></li>
                <li className={`true2 active${menuSelected}`} onClick={()=>handleMenuSelected(2)} tl='Room'><TiGroupOutline /></li>
                <li className={`true3 active${menuSelected}`} onClick={()=>handleMenuSelected(3)} tl='People'><RiContactsLine /></li>
                <li className={`true4 active${menuSelected}`} onClick={()=>handleMenuSelected(4)} tl='Settings'><MdOutlineSettings /></li>

                </ul>
                <Swiper
                    spaceBetween={20}
                    breakpoints={{
                        650: {
                            slidesPerView: 5,
                        },
                        550: {
                            slidesPerView: 4,
                        },
                        460: {
                            slidesPerView: 3,
                        },
                        300: {
                            slidesPerView: 2,
                        },
                        0: {
                            slidesPerView: 1,
                        }
                    }}
                    className={`nav mb swiper_container`}
                >
                    <SwiperSlide>
                        <li className={`true0 active${menuSelected}`} onClick={()=>handleMenuSelected(0)} tl='Profile'><FaRegUser /></li>
                    </SwiperSlide>
                    <SwiperSlide>
                        <li className={`true1 active${menuSelected}`} onClick={()=>handleMenuSelected(1)} tl='Chats'><RiMessage3Line /></li>
                    </SwiperSlide>
                    <SwiperSlide>
                        <li className={`true2 active${menuSelected}`} onClick={()=>handleMenuSelected(2)} tl='Room'><TiGroupOutline /></li>
                    </SwiperSlide>
                    <SwiperSlide>
                        <li className={`true3 active${menuSelected}`} onClick={()=>handleMenuSelected(3)} tl='People'><RiContactsLine /></li>
                    </SwiperSlide>
                    <SwiperSlide>
                        <li className={`true4 active${menuSelected}`} onClick={()=>handleMenuSelected(4)} tl='Settings'><MdOutlineSettings /></li>
                    </SwiperSlide>
                </Swiper>
                <ul className='setting'  ref={settingRef}>
                    <li tl='Mode' onClick={handleLoadMode} className={`mode ${mode} ${loadMode?'loading':''}`}>
                        {
                            !mode?<FaRegMoon />:<CiLight />
                        }
                    </li>
                    <div className='avatar-setting' onClick={handleIsSetting}>
                        <div className={`box-setting ${isSetting?'show':''}`} onClick={handleIsSetting}>
                            <div className='other'>
                                <div className='other-group' onClick={()=>handleMenuSelected(0)}>
                                    <span>Profile</span>
                                    <ImProfile />
                                </div>
                                <div className='other-group' onClick={()=>handleMenuSelected(4)} >
                                    <span>Setting</span>
                                    <IoSettingsOutline />
                                </div>
                            </div>
                            <div className='logout' onClick={handleLogout}>
                                <span>Logout</span>
                                <CiLogout />
                            </div>
                        </div>
                        <img
                            src={currentUser.avatarImage}
                            alt=''
                        ></img>
                        <span className={`dot true`}></span>
                    </div>
                </ul>
            </div>
        </Container>
    )
}
const Container = styled.div`
    .container{
        box-shadow: .1rem .2rem rgba(236, 104, 216,.4);
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        height:100vh;
        gap:1rem;
        padding:1rem 0;
        &.true{
            background-color: #36404A;
            svg{
                color:#ffffff;
            }
            .box-setting{
                background-color: #303841 !important;
                color:#ffffff !important;
                .other-group{
                    background-color: #36404A !important;
                    &:hover{
                        background-color: #414549 !important;
                    }
                }
                .logout{
                    background-color: #36404A !important;
                    &:hover{
                        background-color: #414549 !important;
                    }
                }
            }
        }
        .nav{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            &.pc{
                gap:1rem;   
            }
            &.mb{
                display: none;
            }
            .swiper-wrapper{
                display: flex;
                flex-direction: column;
            }
            li{
                position: relative;
                padding:1rem 2rem;
                color:grey;
                cursor: pointer;
                font-size: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover::after {
                    content: attr(tl);
                    position: absolute;
                    top: -80%;
                    left: 50%;
                    background-color: black;
                    color: #ffffff;
                    font-size: 1rem;
                    padding: .5rem 1rem;
                    transform: translate(-50%,50%);
                    pointer-events: none;
                }
                &.true0.active0{
                    svg{
                        color:#ec68d8;
                    }
                    background-color: #f1d4ec;
                    border-radius: 1rem;
                }
                &.true1.active1{
                    svg{
                        color:#ec68d8;
                    }
                    background-color: #f1d4ec;
                    border-radius: 1rem;
                }
                &.true2.active2{
                    svg{
                        color:#ec68d8;
                    }
                    background-color: #f1d4ec;
                    border-radius: 1rem;
                }
                &.true3.active3{
                    svg{
                        color:#ec68d8;
                    }
                    background-color: #f1d4ec;
                    border-radius: 1rem;
                }
                &.true4.active4{
                    svg{
                        color:#ec68d8;
                    }
                    background-color: #f1d4ec;
                    border-radius: 1rem;
                }
            }
        }
        .setting{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            .mode{
                svg{
                    fill: #000000;
                    font-weight: 700;
                    filter: drop-shadow(0 0 .5rem #000000);
                }
                &.true{
                    svg{
                        fill: yellow;
                        font-weight: 700;
                        filter: drop-shadow(0 0 .5rem yellow);
                    }
                }
                &.loading{
                    pointer-events: none;
                }
            }
            li{
                position: relative;
                padding:1rem 2rem;
                color:grey;
                cursor: pointer;
                font-size: 2rem;
                &.active{
                    color:#ec68d8;
                }
                &:hover::after {
                    content: attr(tl);
                    position: absolute;
                    top: -70%;
                    left: 50%;
                    background-color: black;
                    color: #ffffff;
                    font-size: 1rem;
                    padding: .5rem 1rem;
                    transform: translate(-50%,50%);
                    pointer-events: none;
                }
            }
            .avatar-setting{
                position: relative;
                cursor: pointer;
                img{
                    border: 1px solid #ec68d8;
                    height: 4rem;
                    border-radius: 50%;
                    width: 4rem;
                    padding: .2rem;
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
                .box-setting{
                    z-index: 100000;
                    top:-16rem;
                    left:3rem;
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(15,34,58,.12);
                    border: 1px solid #ec68d8;
                    border-radius: 1rem;
                    padding:1rem;
                    gap:1rem;
                    font-weight: 600;
                    color:#9891AD;
                    display: none;
                    &.show{
                        display: flex;
                    }
                    svg{
                        margin-left: 2rem;
                        font-size: 2rem;
                    }
                    .other{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        gap:.5rem;
                        &-group{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding:1rem;
                            border-radius: .5rem;
                            background-color: #F0F3F9;
                            &:hover{
                                background-color: #fff4fd;
                                color:#ED76DB;
                            }
                        }
                    }
                    .logout{
                        display: flex;
                        align-items: center;
                        padding:1rem;
                        border-radius: .5rem;
                        background-color: #F0F3F9;
                        &:hover{
                            background-color: #fff4fd;
                            color:#ED76DB;
                        }
                        svg{
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }
        .logo{
            img{
                height: 7rem;
            }
        }
        
    }
    @media screen and (max-width: 990px) {
        /* order:1; */
        position: fixed;
        bottom:0;
        left:0;
        z-index: 1000;
        .container{
            height: 7rem;
            width: 100vw;
            flex-direction: row;
            padding: 1rem ;
            border-top: 1px solid #ec68d8;
            li{
                padding:0;
                &:hover::after {
                    display: none !important;
                }
            }
            .nav{
                flex-direction: row;
                border-left:.1rem solid #ec68d8 ; 
                border-right:.1rem solid #ec68d8 ;
                border-radius: .5rem;
                flex:1;
                overflow: hidden;
                padding:0 1rem;
                &.pc{
                    display: none;
                }
                &.mb{
                    display: flex;
                }
                .swiper-wrapper{
                    flex-direction: row;
                }
            }
            .setting{
                flex-direction: row;
                align-items: center;
                .avatar-setting{
                    img{
                        margin:0;
                    }
                    .box-setting{
                        left:-250%;
                    }
                }
            }
            .logo{
                img{
                    height: 6rem;
                }
            }
        }
        
    }
    @media screen and (max-width: 400px) {
        .logo{
                display: none;
            }
    }
    
`
export default Navbar