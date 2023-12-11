import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import EmojiPicker from 'emoji-picker-react';
import spin from '../assets/spin.gif'

import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { BiSolidSend } from "react-icons/bi";
function InputMessage({ handleAddMsg, mode }) {
    const [isSubmit,setIsSubmit] = useState(false)
    const [messageText, setMessageText] = useState('')
    const handleAddMsg1 = (e) => {
        if (!isSubmit&&messageText.trim()!=='') {
            let timeoutSubmit;
            if (e.code === 'Enter' || e.code === 'NumpadEnter' || e === 'submit') {
                handleAddMsg(messageText);
                setMessageText('')
                setIsSubmit(true)
                timeoutSubmit = setTimeout(() => {
                    setIsSubmit(false)
                },500)
            }
            return () => {
                clearTimeout(timeoutSubmit)
            }
        }
    }
    const handleMessageText = (e, from) => {
        from === 'input' ? setMessageText(e.target.value) : setMessageText((messageText) => `${messageText} ${e.emoji}`)
    }
    const [isEmoji, setIsEmoji] = useState(false)
    const handleIsEmoji = (e) => {
        setIsEmoji(!isEmoji)
    }
    const emojiPickerRef = useRef(null);
    const emojiPickerBoxRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEmoji===true&&emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !emojiPickerBoxRef.current.contains(event.target) ) {
                setIsEmoji(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [emojiPickerRef, isEmoji]);
    return (
        <Container>
            <div className={`input ${mode}`}>
                <input
                    onKeyDown={(e)=>handleAddMsg1(e)}
                    value={messageText}
                    type='text'
                    onChange={(e)=>handleMessageText(e,'input')}
                    placeholder='Enter Message...'>
                </input>
            </div>
            <div className='control'>
                <div className='emoji'>
                    <div onClick={handleIsEmoji} ref={emojiPickerRef}>
                        <FaRegFaceSmileBeam />
                    </div>
                    <div className={`emoji-box ${isEmoji}`} ref={emojiPickerBoxRef}>
                        <EmojiPicker
                            onEmojiClick={(e) => handleMessageText(e, 'emoji')}
                            searchDisabled='true'
                            lazyLoadEmojis='true'
                            skinTonesDisabled='true'
                            theme={mode?'dark':'light'}
                            previewConfig={
                                {
                                    showPreview: false
                                }
                            }
                            size={20}
                            width='100%'
                            height={300}
                        ></EmojiPicker>
                    </div>
                </div>
                    <div className={`submit ${isSubmit}`} onClick={() => handleAddMsg1('submit')}>
                    {
                    isSubmit?<img src={spin} alt=""></img>:<BiSolidSend />
                    }
                </div>
            </div>
        </Container>
    )
}
const Container = styled.div`
    width: 100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    .input{
        flex:1;
        &.true{
            input{
                color:#ffffff;
            }
        }
        input{
            width:100%;
            outline:none;
            border: none;
            border-bottom: 1px solid #ec68d8;
            padding: 1rem 2rem;
            background-color: #E6EBF5;
            border-radius: .5rem 0.5rem 0 0;
        }
    }
    .control{
        display: flex;
        align-items: center;
        gap:2rem;
        svg{
            color: #ec68d8;
            cursor: pointer;
            font-size: 1.6rem;
        }
        .emoji{
            position: relative;
            &-box{
                position: absolute;
                bottom:3rem;
                right:-2rem;
                opacity: 0;
                visibility: hidden;
                &.true{
                    opacity: 1;
                visibility: visible;
                }
            }
        }
        .submit{
            background-color: #ec68d8;
            padding:1rem 1.5rem;
            border-radius: .5rem;;
            &.true{
                pointer-events: none;
            }
            svg{
                color:#ffffff;
                font-size: 1.6rem;
            }
            img{
                width:1.6rem;
            }
        }
    }
`
export default InputMessage