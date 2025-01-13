import React, {useState, useRef, useContext, useEffect} from 'react'
import "./advanced.css"
import { ArrowBack } from '@mui/icons-material'
import { Link } from "react-router-dom"
import Navbar from '../../components/Navbar/Navbar'
import ChangePassPopUp from '../../pop-ups/changePass/ChangePassPopUp'
import DeleteAccPopUp from '../../pop-ups/deleteAccount/DeleteAccPopUp'
import TFA from '../../pop-ups/two-factor-auth/tfa'
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify'

const Advanced = () => { 
    
    const { user: loggedInUser, accessToken, axiosJWT } = useContext(AuthContext);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [isPop_upPassOpen, setIsPop_upPassOpen] = useState(false);
    const [isPop_upDeleteAccOpen, setIsPop_upDeleteAccOpen] = useState(false);  
    const [isPop_upTFAOpen, setIsPop_upTFAOpen] = useState(false);   
    
    const [disabled, setDisabled] = useState(null);

    useEffect(() => {
        if (loggedInUser.username !== ""){
            setDisabled(false);
        }
        else{
            setDisabled(true);
        }
    },[])

    const email = useRef();
    const mobile = useRef();

    const updateAdvancedSettings = async (e) => {
        e.preventDefault();

        const updateUser = {
            userId: loggedInUser._id,
            username: email.current.value,
            mobileNumber: mobile.current.value,
        }

        try{
            await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            toast.success("Settings saved!")
            setTimeout(() => {
                window.location.reload()
            }, 3000);
        }
        catch(err){
            console.log(err);
            toast.error("Settings were not saved!")
        }
    }

    const [blur, setBlur] = useState(false)
    useEffect(() => {
        if (isPop_upPassOpen || isPop_upDeleteAccOpen || isPop_upTFAOpen) {
            setBlur(true);
        }
        else{
            setBlur(false);
        }
    }, [isPop_upPassOpen, isPop_upDeleteAccOpen, isPop_upTFAOpen])

  return (
    <>
        <Navbar 
            isPop_upPassOpen={isPop_upPassOpen} 
            isPop_upDeleteAccOpen={isPop_upDeleteAccOpen}
            isPop_upTFAOpen={isPop_upTFAOpen}/>    
        <main className={`${blur ? "main-advanced-container shadow blur-background" : "main-advanced-container shadow"}`}>
            <div className='advanced-header'>
                <Link className='btn go-back-btn' to="/settings" referrerPolicy='no-referrer'>
                    <span><ArrowBack style={{marginTop: "3px"}} /></span>
                </Link>
                <h2>Advanced Settings</h2>
            </div>
            
            <hr></hr>
            <form onSubmit={updateAdvancedSettings}>
                <div className='advanced-fields'>
                    <label htmlFor='email' className='advanced-labels'>Email</label>
                    <input id='email' 
                           className='input-advanced' 
                           type='email' 
                           required
                           placeholder='Add your email...'
                           defaultValue={loggedInUser.username}
                           ref={email}
                           >
                    </input>
                </div>

                <hr className='hr-seperations-advanced'></hr>

                <div className='advanced-fields'>
                    <label htmlFor='mobile' className='advanced-labels'>Mobile</label>
                    <input id='mobile' 
                           className='input-advanced' 
                           type='tel'
                           placeholder='Add your mobile number...'
                           defaultValue={loggedInUser.mobileNumber}
                           ref={mobile}
                           >
                    </input>
                </div>


                <hr className='hr-seperations-advanced'></hr>

                <button type='submit' className='btn save-changes-btn'>Save Changes</button>
            </form>
            <hr></hr>   

            <div className='btn-section'>
                <button className='btn advanced-btn' 
                        onClick={() => {setIsPop_upPassOpen(true)}}>
                            Change Password
                </button>
                <button className={disabled ? "disabledbtn" : 'btn advanced-btn'} 
                        title={disabled ? 'Enter your email above and press save changes to activate this feature' : undefined} 
                        disabled={disabled}  
                        onClick={() => {setIsPop_upTFAOpen(true)}}>
                            Two-factor Authentication
                </button>
                <button className='btn advanced-btn' 
                        onClick={() => {setIsPop_upDeleteAccOpen(true)}}>
                            Delete Account
                </button>
            </div>
            
        </main>
    
        {isPop_upPassOpen && <ChangePassPopUp loggedInUser={loggedInUser} accessToken={accessToken} axiosJWT={axiosJWT} setIsPop_upPassOpen={setIsPop_upPassOpen}/>}

        {isPop_upTFAOpen && <TFA loggedInUser={loggedInUser} setIsPop_upTFAOpen={setIsPop_upTFAOpen} accessToken={accessToken} axiosJWT={axiosJWT}/>}
        
        {isPop_upDeleteAccOpen && <DeleteAccPopUp loggedInUser={loggedInUser} accessToken={accessToken} axiosJWT={axiosJWT} setIsPop_upDeleteAccOpen={setIsPop_upDeleteAccOpen}/>}

    </>
  )
}

export default Advanced;