import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import spin from '../assets/spin.gif'

import styled from 'styled-components'
import Loading from '../components/Loading'
import axios from 'axios'
import { loginRouter } from '../utils/APIRouter';
import { FaCaretDown } from "react-icons/fa6";
import avatarDefault from '../assets/avatarDefault.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegImages } from "react-icons/fa";
import { setProfileRouter } from '../utils/APIRouter';
import { io } from 'socket.io-client';
import server from '../utils/URLserver';
import cat1 from '../assets/cat1.png'
function Profile() {
  const socket = io(server)

  const navigate = useNavigate();
  const [id,setId] = useState(null)
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
  const [values, setValues] = useState({
    fullname: "",
    address: "",
    sex: "",
    image: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [isSubmit,setSubmit] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("chat-app-user")) {
        const { username, password } = JSON.parse(localStorage.getItem("chat-app-user"));
        const { _id } = JSON.parse(localStorage.getItem("chat-app-user"));
        setId(_id)
        try {
          const res = await axios.post(loginRouter, { username, password });
          if (!res.data.status) {
            navigate('/login')        
          }
          else {
            if (res.data.user.isInfoSet) {
              navigate('/')        
            }
          }
        } catch (error) {
        }
      }
      else {
        navigate('/login')        
      }
      setIsLoadingPage(true)
    };
    fetchData();
      const delayLoading = () => {
        setTimeout(() => {
          setIsLoading(true);
        }, 3000);
      };
      delayLoading()
      return () => {
        clearTimeout(delayLoading)
      }
  }, [])

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setValues({ ...values, ['image']: reader.result});
        reader.abort();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true)
    if (values.fullname !== "" && values.address !== "" && values.image !== "" && values.sex !== "") {
      try {
        const res = await axios.post(`${setProfileRouter}/${id}`, values);
        if (res.data.status) {
          localStorage.setItem("chat-app-user", JSON.stringify(res.data.user))
          navigate('/')     
          socket.emit('add-user', res.data.userId)
          
        }
        else {
          toast.error(res.data.msg, toastOption)
        }
        setSubmit(false)
      }
      catch (err) {
        // console.log(err)
      }
    }
    else {
      setSubmit(false)
      toast.error('Chưa hoàn thành các thông tin không hợp lệ.',toastOption);
    }
  }
  const handleChange = (e) => {
    setValues({...values,[e.target.name]: e.target.value})
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
  return (
    <Container>
          <ToastContainer />
      {
        isLoadingPage && (
        !isLoading ? <Loading></Loading> :
            <form onSubmit={handleSubmit} autoComplete='off'>
              <div className='logo'>
                <h1>Profile</h1>
              </div>
            <label className='avatar'>
              <img src={values.image!==""?values.image:avatarDefault} alt='avatar'></img>
              <input hidden onChange={(e)=>{addPhotos(e)}} accept="image/*"  className='input-file' type='file'></input>
              <div className='overlay'>
                <FaRegImages />
              </div>
            </label>
            <input
              value={values.fullname}
              type='text'
              name='fullname'
              placeholder='Họ và tên'
              maxLength={15}
              onChange={(e) => handleChange(e)}
            ></input>
            <input
              value={values.address}
              type='text'
              name='address'
              placeholder='Địa chỉ'
              maxLength={15}
              onChange={(e) => handleChange(e)}
            ></input>
            <label className='input-group' >
              <label>
                <input onChange={(e)=>handleChange(e)} type="radio" id="css" name="sex" value="Nữ"></input>
                <span >NỮ</span>
              </label>
              <label>
                <input onChange={(e)=>handleChange(e)} type="radio" id="css" name="sex" value="Nam"></input>
                <span >NAM</span>
              </label>
            </label>
            <button type='submit' className={isSubmit?'disable':''}>
              {
                isSubmit ? <img src={spin} alt=""></img>:'Create'
              }
              
              </button>
          </form>
        )
      }
    </Container>
  )
}
const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  background-color: #ec68d8;
  padding:1rem 0;
  form{
    width: 40rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #ffffff;
    gap: 2rem;
    padding: 5rem 8rem;
    border-radius: 1rem;
    overflow-y: auto;
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
    .logo{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-bottom: .2rem solid #ececec;
      border-radius: .5rem;
      padding-bottom: 1rem;
      img{
        height: 15rem;
      }
        h1{
          font-size: 4rem;
          color: #ec68d8;
        }
    }
    .input-group{
      width: 100%;
      display: flex;
      align-items: center;
      label{
        cursor: pointer;
        display: flex;
        /* align-items: center; */
        justify-content: center;
        margin-right: 2rem;
        font-weight: 600;
        input{
          cursor: pointer;
          margin-right: 1rem;
        }
      }
    }
    .avatar{
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 50%;
      background-color: #ec68d8;
      height: 15rem;
      width: 15rem;
      object-fit: contain;
      cursor: pointer;
      position: relative;
      &:hover > .overlay{
        opacity:.7;
        visibility: visible;
      }
      .overlay{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #494545;
        opacity: .7;
        z-index: 10;
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 50%;
        opacity: 0;
        visibility: hidden;
        transition: all .125s ease-in-out;
        svg{
          font-size: 4rem;
          color:#ffffff;
        }
      }
      img{
        height: 15rem;
        width: 15rem;
        border-radius: 50%;
      }
    }
    .input-file{
      cursor: pointer;
    }
    .sex{
      cursor: pointer;
      background-color: transparent;
      border: 0.1rem solid #ec68d8;
      border-radius: .5rem;
      outline: none;
      width: 100%;
      padding: 1rem 2rem;
      color: black;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      svg{
        color: #ec68d8;
      }
      &.active .select{
          max-height: 8rem;
          height: 8rem;
        }
      .select{
        height: 0;
        border-right: 0.2rem solid #ec68d8;
        border-left: 0.2rem solid #ec68d8;
        overflow: hidden;
        border-radius: .5rem;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        top:110%;
        left:0;
        max-height: 0;
        transition: max-height .125s ease-in-out;
        .option{
          background-color: #ffffff;
          padding: 1rem 2rem;
          border-bottom: 0.2rem solid #ec68d8;
          border-top: 0.2rem solid #ec68d8;
          &:hover{
            background-color: #cdcdcd;
          }
        }
      }
    }
    
    input{
      background-color: transparent;
      border: 0.1rem solid #ec68d8;
      border-radius: .5rem;
      outline: none;
      width: 100%;
      padding: 1rem 2rem;
      color: black;
      
    }
    button{
      width: 100%;
      padding:1rem 2rem;
      cursor: pointer;
      border: 0.1rem solid #ec68d8;
      background-color: #ffffff;
      border-radius: .5rem;
      transition: .125s linear;
      color: #ec68d8;
      max-height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &.disable{
        pointer-events: none;
      }
      img{
        height: 4rem;
      }
      &:hover{
        color:#ffffff;
        background-color: #ec68d8;
      }
    }
    a{
      text-decoration: none;
      color: #ec68d8;
      font-weight:800;
    }
  }
  @media screen and (max-width: 990px){

    padding:0;
    form{
      width: 100%;
      height: 100%;
      padding:5rem 12rem;
      border-radius: 0;
    }
  }
  @media screen and (max-width: 550px){
    form{
      padding:2rem 3rem;
    }
  }
  @media screen and (max-width: 300px){
    form{
      padding:1rem;
    }
  }
`
export default Profile
