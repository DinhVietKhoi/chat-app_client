import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import { loginRouter, allUserRouter } from '../utils/APIRouter';
import axios from 'axios'
import styled from "styled-components";
import Message from "../components/Message.jsx";
import Navbar from "../components/Navbar.jsx";
import Content from "../components/Content.jsx";
import io from 'socket.io-client'
import server from "../utils/URLserver.jsx";
import { ToastContainer, toast } from 'react-toastify';

function Chat() {
  const [mode, setMode] = useState(false)
  const handleSetMode = () => {
    setMode(!mode)
    localStorage.setItem('mode',!mode)
  }
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
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate()
  const [newUser,setNewUser] = useState(undefined)
  const [newProfile,setNewProfile] = useState(undefined)
  const [newListUser,setNewListUser] = useState(undefined)
  const [newRequest,setNewRequest] = useState(undefined)
  const [onlineUsers,setOnlineUsers] = useState(undefined)
  const [onlineGroup,setOnlineGroup] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)
  const [listUser, setListUser] = useState([])
  const [menuSelected, setMenuSelected] = useState(1)
  const [userSelected, setUserSelected] = useState(undefined)
  const [listFriend, setListFriend] = useState(undefined)
  const [newMsg,setNewMsg] = useState(undefined)
  const handleCurrentUser = (user) => {
    socket.emit('set-profile',user);
    setCurrentUser(user)
  }
  const handleListFriend = (a) => {
    setListFriend(a)
  }
  const HandleUserSelected = (user) => {
    setUserSelected(user)
    if (user !== 'group') {
      socket.emit('disconnect-user-group')
    }
  }
  const handleMenuSelected = (a) => {
    setMenuSelected(a)
  }

  useEffect(() => {
    const newSocket = io(server);
    setSocket(newSocket);
    if (localStorage.getItem("mode")) {
      if (localStorage.getItem("mode") == 'true') {
        setMode(true)
      }
    }
    const fetchData = async () => {
      if (localStorage.getItem("chat-app-user")) {
        const { username, password } = JSON.parse(localStorage.getItem("chat-app-user"));
        try {
          const res = await axios.post(loginRouter, { username, password });
          if (!res.data.status) {
            navigate('/login')        
          }
          else {
            if (!res.data.user.isInfoSet) {
              navigate('/Profile')        
            }
            else {
              localStorage.setItem('chat-app-user', JSON.stringify(res.data.user));
              setCurrentUser(res.data.user)
              setIsLoading(true)
            }
          }

          
        } catch (error) {
          navigate('/login')     
        }
      }
      else {
        navigate('/login')        
      }
    
    };
    fetchData();
    return () => newSocket.disconnect();
  }, [])
  useEffect( () => {
    const fetchData = async () => {
      if (currentUser&&socket) {
        try {
          const allUser = await axios.get(`${allUserRouter}/${currentUser._id}`)
          setListUser(allUser.data)
          socket.emit('user-login', { userId: currentUser._id });
        }
        catch (err) {
        }
        
      }
    };
    fetchData();
  }, [currentUser])
  useEffect(() => {
    if (socket) {
      socket.on('updateUsers', (data) => {
        setOnlineUsers(data)
      })
      socket.on('update-user-group', (data) => {
        setOnlineGroup(data)
      })
      socket.on('new-user', (data) => {
        setNewUser(data)
      })
      socket.on('new-profile', (data) => {
        setNewProfile(data)
      })
      socket.on('new-request', (data) => {
        // setNewUser(data)
        setNewRequest(data)
      })
      return (() => {
        socket.off('new-user')
        socket.off('new-request')
        socket.off('new-profile')
        socket.off('updateUsers')
        socket.off('update-user-group')
      })
    }
  }, [socket])
  const handleNewMsg = (msg) => {
    setNewMsg(msg)
  }
  useEffect(() => {
    if (newMsg && currentUser) {
      if (currentUser._id !== newMsg.sender._id) {
        if (userSelected == undefined) {
          toast.info(`Có tin nhắn mới từ -${newMsg.sender.fullname}-`, toastOption);
        }
        else if(userSelected._id !== newMsg.sender._id ){
          toast.info(`Có tin nhắn mới từ -${newMsg.sender.fullname}-`, toastOption);
        }
        setNewMsg(undefined)
      }
      else {
        setNewMsg(undefined)
      }
    }
  },[newMsg,userSelected,currentUser])
  useEffect(() => {
    newUser && setListUser((pre) => [...pre, newUser])
    setNewUser(undefined)
  }, [newUser])
  useEffect(() => {
    if (newProfile) {
      const indexProfile = listUser.findIndex(l => l._id === newProfile._id)
      if (indexProfile !== -1) {
        const updateProfile = { ...listUser[indexProfile] }
        Object.assign(updateProfile, newProfile);
        const newList = [...listUser]
        newList[indexProfile] = updateProfile
        setListUser(newList)
      }
      
      let LF = listFriend.listFriend
      let LR = listFriend.listRequest
      const indexProfileFriend = LF.findIndex(l => l._id === newProfile._id)
      const indexProfileRequest = LR.findIndex(l => l._id === newProfile._id)
      if (indexProfileFriend !== -1) { 
        const updateProfileLF = { ...LF[indexProfile] }
        Object.assign(updateProfileLF, newProfile);
        const newLF = [...LF]
        newLF[indexProfileFriend] = updateProfileLF
        LF = newLF;
      }
      if (indexProfileRequest !== -1) { 
        const updateProfileLR= { ...LF[indexProfile] }
        Object.assign(updateProfileLR, newProfile);
        const newLR = [...LR]
        newLR[indexProfileFriend] = updateProfileLR
        LR = newLR;
      }
      setListFriend({ listFriend: LF, listRequest: LR })
      setNewProfile(undefined)
    }
  },[newProfile])
  useEffect(() => {
    if (newRequest && currentUser) {
      if (newRequest.id === currentUser._id) {
        // let LR = listFriend.listRequest
        const checkLF = listFriend.listFriend.filter(lf => lf._id === newRequest.user._id)
        const checkLR = listFriend.listRequest.filter(lr => lr._id === newRequest.user._id)
        let LF = listFriend.listFriend;
        if (checkLF.length === 0 && checkLR.length === 0) {
          const LR = [...listFriend.listRequest, newRequest.user]
          const listFR = { listFriend: LF, listRequest: LR }
          setNewListUser(listFR)
        }
      }
    }
  }, [newRequest, currentUser, listFriend])
  useEffect(() => {
    setListFriend(newListUser)

  }, [newListUser])
  return (
    <Container>
      <ToastContainer />
      {
      isLoading&&<div className="container">
          <Navbar
            menuSelected={menuSelected}
            handleMenuSelected={handleMenuSelected}
            currentUser={currentUser}
            mode={mode}
            handleSetMode={handleSetMode}
          ></Navbar>
          <Content
            HandleUserSelected={HandleUserSelected}
            menuSelected={menuSelected}
            currentUser={currentUser}
            listUser={listUser}
            onlineUsers={onlineUsers}
            listFriend={listFriend}
            handleListFriend={handleListFriend}
            handleCurrentUser={handleCurrentUser}
            mode={mode}
            socket={socket}
            userSelected={userSelected}
            onlineGroup={onlineGroup}
            handleNewMsg={handleNewMsg}
          ></Content>
          <Message
            listUser={listUser}
            userSelected={userSelected}
            currentUser={currentUser}
            listFriend={listFriend}
            handleListFriend={handleListFriend}
            socket={socket}
            onlineUsers={onlineUsers}
            mode={mode}
            HandleUserSelected={HandleUserSelected}
            onlineGroup={onlineGroup}
          ></Message>
        </div>
      }
    </Container>
  )
}

const Container = styled.div`
  
  /* display: flex; */
  /* background-color: #6c4666; */
  /* align-items: center; */
  /* justify-content: center; */
  &>.container{
    /* background-color: #4d0243; */
    width: 100vw;
    height: 100vh;
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    border-radius: 1rem;
    @media screen and (max-width:990px){
      flex-direction: column;
    }
  }
`
export default Chat