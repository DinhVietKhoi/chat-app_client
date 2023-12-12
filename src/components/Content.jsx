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
    .content-container{
        min-width: 38rem;
        max-width: 38rem;
        background-color:#F5F7FB ;
        height: 100vh;
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
        background-color: red !important;
        .content-container{
            max-width: 100vw;
            min-width: 100vw;
            height: 100%;
        }
    }

`
export default Content