import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import logo from '../assets/MeowChat.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { loginRouter } from '../utils/APIRouter';
function Login() {
  
  const navigate = useNavigate()
    
  const [isLoading,setIsLoading] = useState(false)

  const [values, setValues] = useState({
    username: "",
    password: "",
  })
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
  const handleValidation = () => {
    const { username, password } = values;
    if (username.trim == '' || password.trim() == '') {
      toast.error('Chưa điền đủ thông tin cần thiết.',toastOption);
      return false;
    }
    if (username.length < 5 || username.length > 20){
      toast.error('Tài khoản phải từ 5-20 ký tự.',toastOption);
      return false;
    }
    else if(password.length <8){
      toast.error('Mật khẩu phải nhiều hơn 8 ký tự.',toastOption);
      return false;
    }
    return true;
  }
  const handleChange = (e) => {
    if (!e.target.value.includes(' ')) {
      setValues({...values,[e.target.name]: e.target.value})
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (handleValidation()) {
      const { username, password } = values;
      try {
        const res = await axios.post(loginRouter, { username, password })
        if (res.data.status) {
          localStorage.setItem("chat-app-user", JSON.stringify(res.data.user))
          navigate('/')        
        }
        else {
          toast.error(res.data.msg, toastOption)
        }
      }
      catch (err) {
        toast.error("Server hiện đang tạm dừng.", toastOption)
      }
      
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("chat-app-user")) {
        const { username, password } = JSON.parse(localStorage.getItem("chat-app-user"));
        try {
          const res = await axios.post(loginRouter, { username, password });
          if (res.data.status) {
            navigate('/')        
          }
        } catch (error) {
          // console.log(error)
        }
      }
      setIsLoading(true)
    };
    fetchData();
  },[])
  return (
    <FromContainer>
      {
        isLoading&&<><ToastContainer />
          <form onSubmit={(e) => handleSubmit(e)} autoComplete='off'>
            <div className='logo'>
              <img src={logo} alt=""></img>
              <h1>Login</h1>
            </div>
            <input
              value={values.username}
              type='text'
              name='username'
              placeholder='Username'
              maxLength='20'
              onChange={(e) => handleChange(e)}
            ></input>
            <input
              value={values.password}
              type='password'
              name='password'
              placeholder='Password'
              onChange={(e) => handleChange(e)}
            ></input>
            <button type="submit">Login</button>
            <span>
              Don't have an account ? <Link to='/register'>Register</Link>
            </span>
            </form>
          </>
      }
          
        </ FromContainer>
  )
}

const FromContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  background-color: #ec68d8;
  padding:1rem 0;
  .logo{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img{
      height: 15rem;
    }
    h1{
      font-size: 4rem;
      color: #ec68d8;
    }
  }
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
      border-radius: 0;
      padding:5rem 12rem;
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

`;
export default Login