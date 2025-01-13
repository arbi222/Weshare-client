import React from 'react'
import "./accbutton.css"
import { logoutCall } from '../../apiCalls';
import { AccountCircle, Settings, ExitToApp} from '@mui/icons-material';
import { Link } from "react-router-dom"

const AccButton = ({user, dispatch}) => {

  const handleClick = () => {
    logoutCall(dispatch)
  }

  return ( 
    <>
        <div className="dropdown-list shadow" >
            <div className='dropdown-components'>
              <a className='navbar-links' referrerPolicy='no-referrer' href={'/profile/' + user._id}>
                <span className='nav-link-arrange'>
                    <AccountCircle />
                    Profile
                </span>
              </a>
              <a className='navbar-links' referrerPolicy='no-referrer' href={'/settings'}>
                <span className='nav-link-arrange'>
                    <Settings />
                    Settings
                </span>
              </a>
              <Link className='navbar-links' onClick={handleClick}>
                <span className='nav-link-arrange'>
                    <ExitToApp />
                    Log Out
                </span> 
              </Link>
            </div>
        </div>
    </>
  )
}

export default AccButton;