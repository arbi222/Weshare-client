import React, {useEffect , useState} from 'react'
import "./forgotPass.css"
import { Close } from "@mui/icons-material"
import axios from "axios"
import { toast } from 'react-toastify'

const ForgotPassPopUp = ({setIsPop_upForgotPassOpen}) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [disabledSaveButton, setDisabledButton] = useState(true);

    const [email, setEmail] = useState("");

    useEffect(() => {   
        if (email !== ""){
            setDisabledButton(false)
        }
        else{
            setDisabledButton(true);
        }
    },[email])


    const handleForgotPass = async (e) => {
        e.preventDefault()

        try{
            const res = await axios.post(apiUrl + "/reset/forgotPassword", {email: email});
            toast.success(res.data);
            setIsPop_upForgotPassOpen(false);
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

  return (
    <>
        <div className="pop-up forgot-pass-container shadow">

            <div className='forgot-pass-pop-up-header'>
                <h2>Forgot Password</h2>
                <button className='btn close-forgot-pop-up-btn' title='Close'
                    onClick={() => setIsPop_upForgotPassOpen(false)}
                    >
                    <Close style={{marginTop: "3px"}} /> 
                </button>
            </div>

            <hr></hr>

            <form onSubmit={handleForgotPass}>
                
                <div className='forgot-pass-field-item'>
                    <label htmlFor='email' className='forgot-pass-labels'>Email</label>
                    <input id='email' 
                           className='forgot-pass-input' 
                           type='email' 
                           placeholder='Enter your email'
                           required
                           autoFocus
                           onChange={(e) => setEmail(e.target.value)}
                           >
                    </input>
                </div>
            
                <hr></hr>

                <button type='submit' 
                        disabled={disabledSaveButton} 
                        className={disabledSaveButton ? 'btn save-changes-btn disabledButton' : 'btn save-changes-btn'}>
                            Send Recovery Link
                </button>
            </form>
        </div>
    </>
  )
}

export default ForgotPassPopUp;
