import React , { useEffect, useState , useRef} from 'react'
import "./deleteacc.css"
import { Close, Visibility, VisibilityOff } from "@mui/icons-material"
import { toast } from 'react-toastify';

const DeleteAccPopUp = ({loggedInUser, accessToken, axiosJWT, setIsPop_upDeleteAccOpen}) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [isShowPassOpen,setIsShowPassOpen] = useState(false);

    useEffect(() => {
        if (isShowPassOpen){
            document.getElementById("delete").type = "text";
        }
        else{
            document.getElementById("delete").type = "password";
            }
    },[isShowPassOpen])

    const password = useRef();

    const deleteAccount = async (e) => {
        e.preventDefault();

        const deleteAccInfo = {
            userId: loggedInUser._id,
            password: password.current.value
        }

        try{
            await axiosJWT.delete(apiUrl + "/users/" + loggedInUser._id, {data: deleteAccInfo, headers: {authorization: `Bearer ${accessToken}`}});
            window.location = "/"
        }
        catch(err){
            toast.error(err.response.data)
        }
    }

  return (
    <>
      <div className="pop-up delete-acc-container shadow">

            <div className='delete-acc-header'>
                <h2>Delete Your Account</h2>
                <button className='btn close-delete-acc-popup' title='Close'
                        onClick={() => {setIsPop_upDeleteAccOpen(false)}}>
                        <Close style={{marginTop: "3px"}}/>
                </button>
            </div>

            <hr></hr>

            <div className='delete-acc-titles'>
                <h3>Are you sure you want to delete your account?</h3>
                <p>If so, please enter your password below</p>
            </div>

            <form onSubmit={deleteAccount}>
                <div className='delete-acc-input-section'>
                    <input id='delete' 
                           className='input-delete-pass' 
                           type='password'
                           placeholder='Enter your password'
                           minLength="6"
                           required
                           ref={password}
                           >
                    </input>                           
                    <button type='button' onClick={() => {setIsShowPassOpen(!isShowPassOpen)}} 
                            className={`${isShowPassOpen ? "show-pass-btn" : "show-pass-btn hide"}`}>
                                <Visibility />
                    </button>
                    <button type='button' onClick={() => {setIsShowPassOpen(!isShowPassOpen)}} 
                            className={`${isShowPassOpen ? "show-pass-btn hide" : "show-pass-btn"}`}>
                                <VisibilityOff />
                    </button>
                </div>

                <hr></hr>

                <button type='submit' className='btn save-changes-btn delete-acc-btn'>Delete Account</button>
            </form>
        </div>
    </>
  )
}

export default DeleteAccPopUp;
