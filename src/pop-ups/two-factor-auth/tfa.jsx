import React , {useState , useRef} from 'react'
import "./tfa.css"
import { Close } from "@mui/icons-material"
import { toast } from 'react-toastify'

const TFA = ({loggedInUser, setIsPop_upTFAOpen, accessToken, axiosJWT}) => {

    const [setupBtn , setSetupBtnClicked] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    const authCode = useRef();

    const sendEmail = async (e) => {
        e.preventDefault();

        try{
            const res = await axiosJWT.post(apiUrl + "/twoFactor/sendEmailCode", {email: loggedInUser.username} , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            toast.success(res.data);
            setSetupBtnClicked(true)
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    const verifyAuthCode = async (e) => {
        e.preventDefault();

        try{
            const res = await axiosJWT.post(apiUrl + "/twoFactor/verifyAuthCode/" + authCode.current.value, {email: loggedInUser.username} , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            toast.success(res.data);
            setTimeout(() => {
                window.location.reload()
            },3000)
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

  return (
    <>
      <div className="pop-up tfa-container shadow">

            <div className='tfa-header'>
                <h2>Two Factor Authentication</h2>
                <button className='btn close-delete-tfa-popup' onClick={() => setIsPop_upTFAOpen(false)}>
                    <Close style={{marginTop: "3px"}}/>
                </button>
            </div>

            <hr></hr>

            {setupBtn ? 
                <>
                <div className='tfa-titles'>
                    <h3>Verify Code</h3>
                    <p>To change the settings, please enter the code that you received in your email:</p>
                </div>

                <form onSubmit={verifyAuthCode}>
                    <div className='tfa-input-section'>
                        <input  
                            autoFocus
                            className='input-tfa-pass' 
                            type='text'
                            placeholder='Authentication Code'
                            required
                            ref={authCode}>
                        </input>                           
                    </div>

                    <hr></hr>

                    <div className='tfa-buttons'>
                        <button type='button' className='btn tfa-btn-close' onClick={() => {setSetupBtnClicked(false)}}>Close</button>
                        <button type='submit' className='btn tfa-btn'>{loggedInUser?.isTwoFactorAuthOn ? "Verify & Deactivate" : "Verify & Activate"}</button>
                    </div>
    
                </form>

                </>
            :   
                <>
                <div className='tfa-titles'>
                    <p>
                        {loggedInUser?.isTwoFactorAuthOn ? "Two factor authentication is currently activated" : "Secure your account with two factor authentication"}
                    </p>
                </div>
                <form onSubmit={sendEmail}>
                    <button className='btn twofabtn' type='submit'>
                        {loggedInUser?.isTwoFactorAuthOn ? "Deactivate 2FA" : "Activate 2FA"}
                    </button>
                </form>
                </>
            }

        </div>
    </>
  )
}

export default TFA;
