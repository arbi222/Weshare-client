import React, {useEffect , useState, useRef} from 'react'
import "./changepass.css"
import axios from "axios"
import { Close , Visibility , VisibilityOff } from "@mui/icons-material"
import { toast } from 'react-toastify'

const ChangePassPopUp = ({loggedInUser, accessToken, axiosJWT, setIsPop_upPassOpen, resetPassToken}) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [isShowPassOpen, setIsShowPassOpen] = useState(false);
    const [newPassValues, setNewPassValues] = useState({new: '', confirm: ''});
    const oldPass = useRef();

    const [isChecked, setIsChecked] = useState(false)
    const [disabledSaveButton, setDisabledButton] = useState(true)

    useEffect(() => {
        if (!resetPassToken){
            if (isShowPassOpen){
                document.getElementById("old").type = "text";
            }
            else{
                document.getElementById("old").type = "password";
            }
        }
    },[isShowPassOpen])

    useEffect(() => {
        if (isChecked){
            document.getElementById("new").type = "text";
            document.getElementById("confirm").type = "text";
            document.getElementById("pass-alert").classList.add("hide");
        }
        else{
            document.getElementById("new").type = "password";
            document.getElementById("confirm").type = "password";
            if ((newPassValues.new !== '' && newPassValues.confirm !== '') && (newPassValues.new !== newPassValues.confirm)){
                document.getElementById("pass-alert").classList.remove("hide");
            }
        }
    },[isChecked])

    useEffect(() => {
        if (newPassValues.new !== '' && newPassValues.confirm !== ''){
            if (newPassValues.new !== newPassValues.confirm){
                document.getElementById("pass-alert").classList.remove("hide");
                setDisabledButton(true)
            }
            else{
                document.getElementById("pass-alert").classList.add("hide");
                setDisabledButton(false)
            }
        }
        else{
            document.getElementById("pass-alert").classList.add("hide");
            setDisabledButton(false)
        }
    },[newPassValues])


    const newPassOnChangeHandler = (pass) => {
        return (event) => {
            setNewPassValues({...newPassValues, [pass]: event.target.value});
        };
    };
    
    const changePassForm = async (e) => {
        e.preventDefault();

        const updatePass = {
            userId: !resetPassToken ? loggedInUser._id : null,
            oldPass: !resetPassToken ? oldPass.current.value : null,
            newPassword: newPassValues.new,
            confirmPassword: newPassValues.confirm
        }

        try{
            if (resetPassToken){
                const res = await axios.post(apiUrl + "/reset/resetPassword/" + resetPassToken, updatePass);
                toast.success(res.data);
                setTimeout(() => {
                    window.location.href = "/login";
                },3500)
            }
            else{
                const res = await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updatePass , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                })
                toast.success(res.data);
                setTimeout(() => {
                    window.location.reload();
                },3500)
            }
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

  return (
    <>
        <div className="pop-up change-pass-container shadow">

            <div className='pass-pop-up-header'>
                {resetPassToken ? <h2>Reset Password</h2> : <h2>Change Password</h2>}
                {!resetPassToken &&
                    <button className='btn close-pop-up-btn' title='Close'
                        onClick={() => setIsPop_upPassOpen(false)}
                        >
                        <Close style={{marginTop: "3px"}} /> 
                    </button>
                }
            </div>

            <hr></hr>

            <form onSubmit={changePassForm}>
                <div className='change-pass-fields'>
                    {!resetPassToken &&
                        <div className='change-pass-field-item'>
                            <label htmlFor='old' className='pass-labels'>Old Password</label>
                            <input id='old' 
                                   className='pass-input' 
                                   type='password' 
                                   placeholder='Enter your old password'
                                   required
                                   ref={oldPass}
                                   autoFocus
                                   >
                            </input>
                            <button type="button" onClick={() => {setIsShowPassOpen(!isShowPassOpen)}} 
                                    className={`${isShowPassOpen ? "show-pass-buttons" : "show-pass-buttons hide"}`}>
                                        <Visibility />
                            </button>
                            <button type="button" onClick={() => {setIsShowPassOpen(!isShowPassOpen)}} 
                                    className={`${isShowPassOpen ? "show-pass-buttons hide" : "show-pass-buttons"}`}>
                                        <VisibilityOff />
                            </button>
                        </div>
                    }

                    <div className='change-pass-field-item'>
                        <label htmlFor='new' className='pass-labels'>New Password</label>
                        <input id='new' className='pass-input' autoFocus={resetPassToken} minLength={6} required type='password' value={newPassValues.new}
                                placeholder='Enter your new password' onChange={newPassOnChangeHandler('new')}></input>
                    </div>

                    <div className='change-pass-field-item'>
                        <label htmlFor='confirm' className='pass-labels'>Confirm Password</label>
                        <input id='confirm' className='pass-input' minLength={6} required type='password' value={newPassValues.confirm}
                                placeholder='Confirm your password' onChange={newPassOnChangeHandler('confirm')}></input>
                    </div>

                    <div className='checkbox-password'>
                        <input id='checkbox' checked={isChecked} type="checkbox" onChange={() => setIsChecked(!isChecked)}/>
                        <label htmlFor="checkbox">Show New Password</label>
                    </div>

                    <p id='pass-alert' className='pass-alert-mismatch hide'>New Password & Confirm Password do not match.</p>
                </div>

                <hr></hr>

                <button type='submit' 
                        disabled={disabledSaveButton} 
                        className={disabledSaveButton ? 'btn save-changes-btn disabledButton' : 'btn save-changes-btn'}>
                            {resetPassToken ? "Save New Password" : "Save Changes"}
                </button>
            </form>
        </div>

    </>
  )
}

export default ChangePassPopUp;
