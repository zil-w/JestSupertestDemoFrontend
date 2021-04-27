import React from 'react'
import {useSelector} from 'react-redux'

const SystemMessage = () => {
  const msgState = useSelector(state => state.notification)

  const errorStyle = {
    color: 'red',
    width: 500,
    borderWidth: 'thin',
    border: 'solid red'
  }

  const successStyle = {
    color: 'green',
    width: 500,
    borderWidth: 'thin',
    border: 'solid green'
  }

  if(msgState.message === ''){//this is probably worse performance than to just do the conditional rendering inside app.js
    return(<></>)
  }
  else{
    return(<p id = 'system-status' style={msgState.isError ? errorStyle : successStyle}>{msgState.message}</p>)
  }
}

export default SystemMessage