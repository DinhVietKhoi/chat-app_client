import React, { useState } from 'react'
import Switch from "react-custom-checkbox/switch";

const checkedTrackStyle = {
      opacity: 1,
      transition: 'all 0.125s ease-in-out',
      backgroundColor: '#ec68d8',
    }
    const checkedIndicatorStyle = {
      backgroundColor: '#ffffff',
      transform: 'translateX(15px)',
    }
    const checkedIconStyle = {
      opacity: 1,
      transition: 'all 0.125s ease-in-out',
    }
    const indicatorStyle = {
      alignItems: 'center',
      backgroundColor: '#B9B9BF',
      borderRadius: 24,
      bottom: 2,
      display: 'flex',
      height: 10,
      justifyContent: 'center',
      left: 2,
      outline: 'solid 2px transparent',
      position: 'absolute',
      transition: '0.25s',
      width: 10,
    }
  const trackStyle = {
    backgroundColor: '#e5efe9',
      border: '1px solid #ec68d8',
      borderRadius: 15,
      cursor: 'pointer',
      display: 'flex',
      height: 15,
      position: 'relative',
      width: 30,
  }
function Checkbox() {
  const [switchOneCheck, setSwitchOneCheck] = useState(true);
  const handleChangeCheckBox = () => {
    setSwitchOneCheck(!switchOneCheck)
  }
  return (
    <Switch
        checked={switchOneCheck}
        onChange={handleChangeCheckBox}
        indicatorStyle={indicatorStyle}
        trackStyle={trackStyle}
        checkedIconStyle={checkedIconStyle}
        checkedIndicatorStyle={checkedIndicatorStyle}
        checkedTrackStyle={checkedTrackStyle}
        />
  )
}

export default Checkbox