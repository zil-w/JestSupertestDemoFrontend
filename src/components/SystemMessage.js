import React from 'react'

const SystemMessage = ({ isError, sysMsg }) => {
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

  //console.log('received message:', sysMsg)

  if(sysMsg === ''){
    //console.log('is detecting empty message')
    return(<></>)
  }
  else{
    //console.log('is detecting non empty message')
    return(<p id = 'system-status' style={isError ? errorStyle : successStyle}>{sysMsg}</p>)
  }
}

export default SystemMessage