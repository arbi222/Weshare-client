import React from 'react'
import "./resetPass.css"
import { useParams } from 'react-router';
import ChangePassPopUp from '../../pop-ups/changePass/ChangePassPopUp';

const ResetPassPage = () => {

    const resetPassToken = useParams().token;
    
    return <>
        <div className='navbar-container shadow'>
            <div className="navbar-left">
              <a href="/" referrerPolicy='no-referrer' style={{textDecoration:"none"}}>
                <span className='nav-logo'>WeShare</span>
              </a>
            </div>
        </div>

        <ChangePassPopUp resetPassToken={resetPassToken} />
    </>
}

export default ResetPassPage;