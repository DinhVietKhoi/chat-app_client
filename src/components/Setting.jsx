import React, { useState } from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import { TbArrowsJoin } from "react-icons/tb";
import { FaDotCircle } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import Checkbox from './Checkbox';
import { LuMousePointerClick } from "react-icons/lu";
import timeAgo from '../helpers/timeAgo';
import axios from 'axios'
import {setProfileRouter} from '../utils/APIRouter'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Setting({ currentUser, handleCurrentUser, mode }) {
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
    const [editProfile, setEditProfile] = useState(false)
    const [valueProfile, setValueProfile] = useState(currentUser&&{fullname:currentUser.fullname,address:currentUser.address})
    
    const handleValueProfile = (e) => {
        setValueProfile((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }
    const [image,setImage] = useState(undefined)
    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setValues({ ...values, ['image']: reader.result});
            reader.abort();
        }
    }
    const addPhotos = (e) =>{
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size < 1000*1024) {
            setFileToBase(file)
            }
            else {
            setValues({ ...values, ['image']: ""});
            toast.error('Ảnh không hợp lệ(<1MB).',toastOption);
            }
        } else {
            setValues({ ...values, ['image']: ""});
            toast.error('Ảnh không hợp lệ.',toastOption);
        }
    }

    const handleEditProfile = async () => {
        if (valueProfile.fullname.trim() == '' || valueProfile.address.trim() === '') {
            toast.error("Cần điền đầy đủ thông tin.", toastOption)
        }
        else {
            setEditProfile(!editProfile)
        if (editProfile) {
            const res = await axios.post(`${setProfileRouter}/${currentUser._id}`, valueProfile)
            handleCurrentUser(res.data.user)
            setValueProfile({ fullname: res.data.user.fullname,address: res.data.user.address})
        }
        }
        
    }
    const [statusInfo, setStatusInfo] = useState(false)
    const [statusSecurity, setStatusSecurity] = useState(true)
    const [statusHelp, setStatusHelp] = useState(true)
    const handleGroupSize = (a) => {
        a === 'info' && setStatusInfo(!statusInfo)
        a === 'security' &&setStatusSecurity(!statusSecurity)
        a === 'help' &&setStatusHelp(!statusHelp)
    }

    return (
        <Container>
          <ToastContainer />
            <div className={`container ${mode}`}>
            <div className='header'>
                    <div className='header-group'>
                    <h1><TbArrowsJoin />Setting <TbArrowsJoin /></h1>
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
                <div className='body'>
                    <div className={`info group ${statusInfo}`}>
                        <div className='title' onClick={()=>handleGroupSize('info')}>
                            <div className='title-group'>
                                <h3>
                                <IoIosInformationCircleOutline />
                                    Personal Info</h3>
                            </div>
                            {
                                statusInfo?<FaCaretUp />:<FaCaretDown />
                            }
                            
                        </div>
                        <div className={`edit ${editProfile}`} onClick={handleEditProfile}>
                            <CiEdit />
                            <span>{editProfile?'Save':'Edit'}</span>
                        </div>
                        <div className='group-item'>
                            <span>Email</span>
                            <p>{currentUser.email }</p>
                        </div>
                        <div className='group-item'>
                            <span>Name</span>
                            {
                                !editProfile ?
                                <p>{currentUser.fullname}</p> :
                                    <input
                                        name="fullname"
                                        placeholder='Họ và tên...'
                                        maxLength={15}
                                        value={valueProfile.fullname}
                                        onChange={handleValueProfile}
                                    ></input>
                            }
                        </div>
                        <div className='group-item'>
                            <span>Address</span>
                            {
                                !editProfile ?
                                <p>{currentUser.address}</p> :
                                    <input
                                        name="address"
                                        placeholder='Địa chỉ...'
                                        maxLength={30}
                                        value={valueProfile.address}
                                        onChange={handleValueProfile}
                                    ></input>
                            }
                        </div>
                        <div className='group-item'>
                            <span>Joining Date</span>
                            <p>{timeAgo(currentUser.createdAt)}</p>
                        </div>
                    </div>
                    <div className={`other group ${statusSecurity}`}>
                        <div className='title' onClick={()=>handleGroupSize('security')}>
                            <div className='title-group'>
                                <h3>
                                <IoIosInformationCircleOutline />
                                Security(<p>chưa xử lý</p>)</h3>
                            </div>
                            {
                                statusSecurity?<FaCaretUp />:<FaCaretDown />
                            }
                            
                        </div>
                        <div className='group-item'>
                            <span>Hide information</span>
                            <Checkbox></Checkbox>
                        </div>
                        <div className='group-item'>
                            <span>Turn off Activity Status</span>
                            <Checkbox></Checkbox>
                        </div>
                    </div>
                    <div className={`other group ${statusHelp}`}>
                        <div className='title' onClick={()=>handleGroupSize('help')}>
                            <div className='title-group'>
                                <h3>
                                <IoIosInformationCircleOutline />
                                Help</h3>
                            </div>
                            {
                                statusHelp?<FaCaretUp />:<FaCaretDown />
                            }
                            
                        </div>
                        <div className='group-item'>
                            <span>Contact</span>
                            <Link target="_blank" to="https://www.facebook.com/profile.php?id=100075410734346">Viết Khôi<LuMousePointerClick /></Link>
                        </div>
                        <div className='group-item'>
                            <span>Current version</span>
                            <p>1.0.0</p>
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
        &.true .group-item input{
            color:#ffffff;
        }
    }
    .header{
        width: 100%;
        &-group{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
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
                transform: rotate(180deg);
                font-size: 2rem;
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
            font-size: .5rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap:.2rem;
            &.active{
                color:#06D6A6;
            }
            &.busy{
                color:#d60606;
            }
            svg{
            }
            span{
                font-size: 1rem;
                font-weight: 500;
                margin: 0;
            }
        }
    }
    .body{
        width: 100%;
        
        h3{
            font-weight: 500;
            display: flex;
            align-items: center;
        }
        .edit{
            display: flex;
            gap:.5rem;
            align-items: center;
            position: absolute;
            top:5.5rem;
            right:1.5rem;
            padding:1rem;
            border-radius: .5rem;
            transition: .125s linear;
            &:hover{
                background-color: #E6EBF5;
                cursor: pointer;
                color:#ec68d8;
            }
            &.true{
                color:#ec68d8;
            }
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
            position: relative;
            margin-bottom: 2rem;
            &:last-child(1){
                margin-bottom: 0rem;
            }
            &.true{
                    max-height: 5rem;
                    min-height: 4rem;
                }
            &.other > .group-item{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                span{
                    /* color:black; */
                }
                label{
                    margin: 0 !important;
                    cursor: pointer;
                }
                a{
                    color: #ec68d8;
                    display: flex;
                    align-items: center;
                    gap:.2rem;
                }
            }
            &-item{
                width: 100%;
                display: flex;
                flex-direction: column;
                gap:.5rem;
                font-weight: 500;
                span:first-child{
                    font-weight: 500;
                    color:#a3a4a4;
                }
                p{
                    display: flex;
                    align-items: center;
                    svg{
                        margin-left: .3rem;
                    }
                }
                input{
                    padding:.5rem 1rem;
                    outline: none;
                    border: none;
                    border-bottom: .1rem solid #ec68d8;
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
                        p{
                            color: #ec68d8;
                            font-size: 1rem;
                            align-self: flex-end;
                        }
                    }
                }
            }
        }
    }
`
export default Setting