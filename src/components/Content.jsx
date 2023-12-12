import React from 'react'
import styled from 'styled-components'
import Profile from './Profile'
import Room from './Room'
import Chats from './Chats'
import Friends from './Friends'
import Setting from './Setting'

function Content(
    {
        socket,
        menuSelected,
        currentUser,
        listUser,
        HandleUserSelected,
        onlineUsers,
        listFriend,
        handleListFriend,
        handleCurrentUser,
        mode,
        userSelected,
        onlineGroup,
        handleNewMsg
    }
) {
    
    const arrayContent = [
        <Profile 
            key="profile-key"
            currentUser={currentUser}
            handleCurrentUser={handleCurrentUser}
            mode={mode}
        ></Profile>,
        <Chats 
            key="chats-key"
            listUser={listUser}
            HandleUserSelected={HandleUserSelected}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            listFriend={listFriend}
            mode={mode}
            handleListFriend={handleListFriend}
            socket={socket}
            userSelected={userSelected}
            handleNewMsg={handleNewMsg}
        ></Chats>,
        <Room 
            mode={mode}
            HandleUserSelected={HandleUserSelected}
            socket={socket}
            currentUser={currentUser}
            onlineGroup={onlineGroup}
            key="room-key"
        ></Room>,
        <Friends 
            key="contact-key"
            onlineUsers={onlineUsers}
            listUser={listUser}
            mode={mode}
            HandleUserSelected={HandleUserSelected}
        ></Friends>,
        <Setting 
            key="setting-key"
            currentUser={currentUser}
            mode={mode}
            handleCurrentUser={handleCurrentUser}
        ></Setting>
    ]
    return (
        <Container>
            <div className={`content-container ${mode}`}>
                {
                    arrayContent.map((content, index) => {
                        if (index === menuSelected) { 
                            return content;
                        }
                        return null;
                    })
                }
            </div>
        </Container>
    )
}
const Container = styled.div`
    max-height: 100vh;
    min-width: 38rem;
    height: 100vh;
    width: 38rem;
    .content-container{
        width: 100%;
        background-color:#F5F7FB ;
        height: 100%;
        padding:2rem;
        overflow: hidden;
        box-shadow: .1rem .2rem rgba(236, 104, 216,.4);
        &.true{
            background-color: rgb(48,56,65);
            color:#ffffff;
        }
    }
    @media screen and (max-width: 990px){
        flex:1;
        overflow:hidden;
        padding-bottom: 7rem;
        min-width: 100vw;
        width: 100vw;
    }

`
export default Content