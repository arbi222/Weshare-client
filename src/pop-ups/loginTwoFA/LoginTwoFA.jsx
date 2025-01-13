import React , {useRef} from 'react'
import "./loginTwoFA.css"
import axios from 'axios'
import Cookies from 'js-cookie'
import { Close } from "@mui/icons-material"
import { toast } from 'react-toastify'

const LoginTFA = ({user, dispatch, setTwoFactorPopUpOpen}) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const authCode = useRef(); 

    const verifyAuthCode = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post(apiUrl + "/twoFactor/verifyLoginAuthCode/" + authCode.current.value, {email: user.username});
            dispatch({type: "LOGIN_SUCCESS", payload: {userInfo: user, accessToken: res.data}});
            Cookies.set("accessToken", res.data, {
                secure: true,
                sameSite: "strict",
                path: "/"
            })
            setTwoFactorPopUpOpen(false)
            toast.success("Login granted!");
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

  return (
    <>
      <div className="pop-up tfa-login-container shadow">

            <div className='tfa-login-header'>
                <h2>Two Factor Authentication</h2>
                <button className='btn close-tfa-login-popup' title='Close' onClick={() => setTwoFactorPopUpOpen(false)}>
                    <Close style={{marginTop: "3px"}}/>
                </button>
            </div>

            <hr></hr>
                
            <div className='tfa-login-titles'>
                <p>Please enter the code that you received in your email in order to login:</p>
            </div>
            <form onSubmit={verifyAuthCode}>
                <div className='tfa-login-input-section'>
                    <input  
                        autoFocus
                        className='input-tfa-login-pass' 
                        type='text'
                        placeholder='Authentication Code'
                        required
                        ref={authCode}>
                    </input>                           
                </div>
                <hr></hr>
                <div className='tfa-buttons'>
                    {/* <button type='button' className='btn tfa-btn-close' onClick={() => {setSetupBtnClicked(false)}}>Close</button> */}
                    <button type='submit' className='btn tfa-login-btn'>Verify Code</button>
                </div>

            </form>

        </div>
    </>
  )
}

export default LoginTFA;
