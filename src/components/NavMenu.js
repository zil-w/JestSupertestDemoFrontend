import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const NavMenu = ({ name, logoutHandler }) => {
    return <div style={{ backgroundColor: 'gray' }}>
        <Link to='/'>blogs</Link>
        {' '}
        <Link to='/users'>users</Link>
        {' '}
        Logged in as {name}
        {' '}
        <Button name = 'logout' action = {logoutHandler}/>
    </div>
}

export default NavMenu