import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoSearch } from "react-icons/io5";
import { TbArrowsJoin } from "react-icons/tb";
import UserItem from './UserItem';
import spin from '../assets/spin.gif'
import { FaSortAmountDown } from "react-icons/fa";
import { searchUserRouter } from '../utils/APIRouter';
import axios from 'axios';

function Friends({ onlineUsers, listUser, HandleUserSelected, mode }) {
    const [valueSearch, setValueSearch] = useState('');
    const [loadSearch, setLoadSearch] = useState(false)
    const [statusSort, setStatusSort] = useState('all')
    const [listUserSort, setListUserSort] = useState(listUser)
    const handleChangeValueSearch = (e) => {
        setLoadSearch(true)
        setValueSearch(e.target.value)
    }
    useEffect(() => {
        if (valueSearch !== '') {
            const searchDelay = setTimeout(async () => {
                setLoadSearch(false)
                setStatusSort('all')
                try {
                    const res = await axios.get(searchUserRouter, { params: { valueSearch } })
                    setListUserSort(listUser.filter(e => res.data.includes(e._id)))
                }
                catch (err) {
                }
                
            }, 1000)
            return () => clearTimeout(searchDelay)
        }
        else {
            setLoadSearch(false)
            statusSort === 'offline' ?
            setListUserSort(listUser.filter(e => !onlineUsers.includes(e._id))) :
            statusSort === 'online' ?
                setListUserSort(listUser.filter(e => onlineUsers.includes(e._id))) :
                setListUserSort(listUser)
        }
    }, [valueSearch,statusSort,listUser,onlineUsers])
    const handleSort = (a) => {
        setValueSearch('')
        setStatusSort(a)
        a === 'offline' ?
            setListUserSort(listUser.filter(e => !onlineUsers.includes(e._id))) :
            a === 'online' ?
                setListUserSort(listUser.filter(e => onlineUsers.includes(e._id))) :
                setListUserSort(listUser)
    }
    return (
        <Container>
            <div className={`container ${mode}`}>
                <div className='header'>
                    <div className='header-group'>
                        <h1><TbArrowsJoin />Contacs<TbArrowsJoin /></h1>
                    </div>
                    <div className='search'>
                        <div className='icon-search'>
                            {
                                loadSearch?<img src={spin} alt=''></img>:<IoSearch />
                            }
                        </div>
                        <input value={valueSearch} onChange={(e)=>handleChangeValueSearch(e)} placeholder='Search name...'></input>
                    </div>
                    <div className='sort'>
                        <div className={`sort-item all ${statusSort==='all'&&'active'}`} onClick={()=>handleSort('all')}>
                            <span className='dot'></span>Tất cả
                        </div>
                        <div className={`sort-item online ${statusSort==='online'&&'active'}`} onClick={()=>handleSort('online')}>
                            <span className='dot'></span>Online
                        </div>
                        <div className={`sort-item offline ${statusSort==='offline'&&'active'}`} onClick={()=>handleSort('offline')}>
                            <span className='dot'></span>Offline
                        </div>
                        <div className='sort-item'>
                            <FaSortAmountDown />
                        </div>
                    </div>
                </div>
                <div className='body'>
                    <div className='list-friend'>
                        {
                            listUserSort.length > 0 ? listUserSort.map((user) => {
                                return <UserItem mode={mode} onlineUsers={onlineUsers} key={user._id} user={user} HandleUserSelected={HandleUserSelected}></UserItem>
                            }) :
                                <span className='not-user'>Không có người dùng.</span>
                        }
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
        
        &.true{
            .search{
            background-color: #36404A;
            input{
                color:#ffffff;
            }
            
        }
        .dot{
                border: .1rem solid #ec68d8 !important;
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
            gap:1rem;
            .icon-search{
                width: 2rem;
                height: 2rem;
                img{
                    width: 100%;
                    height: 100%;
                }
                svg{
                    width: 100%;
                    height: 100%;
                }
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
        .sort{
            display: flex;
            justify-content: flex-end;
            gap:1rem;
            font-weight: 600;
            padding:0 1rem;
            &-item{
                display: flex;
                align-items: center;
                gap:.5rem;
                font-size: 1rem;
                cursor: pointer;
                position: relative;
                &.active{
                    &::after{
                        position: absolute;
                        content: "";
                        bottom:-.5rem;
                        left:0;
                        /* width: 100%; */
                        height: .2rem;
                        background-color: #ec68d8;
                        animation: animationChoose .3s ease forwards;
                        border-radius: .5rem;
                    }
                    color:#ec68d8;
                }
                
                &:last-child{
                    cursor: default;
                    font-size: 1.4rem;
                }
            }
            .dot{
                display: block;
                width: 1rem;
                height: 1rem;
                border: 1px solid #000000;
                border-radius: 50%;
            }
            .all{
                .dot{
                    background-color: #ffffff;
                }
            }
            .online{
                .dot{
                    background-color: #06D6A6;
                }
            }
            .offline{
                .dot{
                    background-color: #d60606;
                }
            }
        }
    }
    .body{
        width: 100%;
        padding-right: 1rem;
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
        .list-friend{
            display: flex;
            width: 100%;
            gap:1rem;
            flex-direction: column;
            .not-user{
                font-size: 1rem;
                color:#ec68d8;
            }
        }
    }
    @keyframes animationChoose {
        0%{
            width: 0;
        }
        100%{
            width: 100%;
        }
    }
`
export default Friends