import React , {useContext, useEffect, useRef , useState} from 'react'
import { useLocation } from 'react-router-dom';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import "./login.css"
import { Visibility , VisibilityOff } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import Register from '../../pop-ups/register/Register';
import ForgotPassPopUp from '../../pop-ups/forgotPass/ForgotPass';
import LoginTFA from '../../pop-ups/loginTwoFA/LoginTwoFA';

const Login = () => {

    const [isPop_upForgotPassOpen, setIsPop_upForgotPassOpen] = useState(false)
    const [isTwoFactorPopUpOpen, setTwoFactorPopUpOpen] = useState(false)
    const [isRegisterOpen , setRegisterOpen] = useState(false)
    const location = useLocation();
 
    const [isShowPassOpen, setIsShowPassOpen] = useState(false);
    const [isPassContainerOn, setPassContainerOn] = useState(false);
    const [newLoginValues, setNewLoginValues] = useState({email: '', pass: ''});
    
    useEffect(() => {
        if (newLoginValues.pass === ''){
            document.getElementsByClassName("show-hide-pass")[0].classList.add("hide");
            document.getElementsByClassName("show-hide-pass")[1].classList.add("hide");
        }
        else{
            if (isShowPassOpen){
                document.getElementsByClassName("show-hide-pass")[0].classList.remove("hide");
                document.getElementsByClassName("show-hide-pass")[1].classList.add("hide");
                }
            else{
                document.getElementsByClassName("show-hide-pass")[1].classList.remove("hide");
                }
            }
        },[newLoginValues.pass])


    useEffect(() => {
        if (isShowPassOpen){
            document.getElementById("pass-enter").type = "text";
        }
        else{
            document.getElementById("pass-enter").type = "password";
            }
    },[isShowPassOpen])


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let timeoutId;

        if (searchParams.get("registerFromMessenger") === "true"){
            timeoutId = setTimeout(() => {
                setRegisterOpen(true);
            }, 300);
        }
        else if (searchParams.get("recoverPassFromMessenger") === "true"){
            timeoutId = setTimeout(() => {
                setIsPop_upForgotPassOpen(true);
            }, 300);
        }

        return () => {
            clearTimeout(timeoutId);
        }
    },[location.search])


    const email = useRef();
    const password = useRef();
    const {user, isFetching, dispatch, askingForTwoFaCode} = useContext(AuthContext);

    useEffect(() => {
        if (askingForTwoFaCode) {
            setTwoFactorPopUpOpen(true);
        }
        else{
            setTwoFactorPopUpOpen(false);
        }
    },[askingForTwoFaCode])

    
    const handleLogInClick = (e) => {
        e.preventDefault()
        loginCall({username: email.current.value, password: password.current.value}, dispatch)
    }

    const credentialsHandler = (credentials) => {
        return (event) => {
            setNewLoginValues({...newLoginValues, [credentials]: event.target.value});
        };
    };

    const [blur, setBlur] = useState(false)
    useEffect(() => {
        if (isRegisterOpen || isPop_upForgotPassOpen || isTwoFactorPopUpOpen) {
            setBlur(true);
        }
        else{
            setBlur(false);
        }
    }, [isRegisterOpen, isPop_upForgotPassOpen, isTwoFactorPopUpOpen])


    return (
        <>
            <main className={blur ? 'main-login-container blur-background' : 'main-login-container'}>

                <div className='first-login-section'>
                    <h1>Weshare</h1>
                    <p>Connect with your friends from all over the world on Weshare.</p>
                </div>
                <div className='second-login-section shadow'>
                    <form onSubmit={handleLogInClick}>
                        <div className='sensitive-data-input'>
                            <input className='login-input-field' type='email'  
                                    autoFocus placeholder='Enter your email'
                                    onInvalid={e => e.target.setCustomValidity("Please enter your email")} 
                                    onInput={e => e.target.setCustomValidity('')}  
                                    required
                                    onChange={credentialsHandler('email')}
                                    ref={email}>
                            </input>
                            <div className={`${isPassContainerOn ? "pass-container login-input-field" : "login-input-field"}`}> 
                                <input id='pass-enter' type='password' placeholder='Enter your password' 
                                    required
                                    onInvalid={e => e.target.setCustomValidity("Please enter your password")} 
                                    onInput={e => e.target.setCustomValidity('')} 
                                    minLength="6"
                                    onFocus={() => {setPassContainerOn(true)}} 
                                    onBlur={() => {setPassContainerOn(false)}}
                                    onChange={credentialsHandler('pass')}
                                    ref={password}> 
                                </input>
                            </div>
                        </div>
                        
                        <button className='btn login-btn' type='submit' disabled={isFetching}>
                            {isFetching ? <CircularProgress className='loader-login' color='#fff' size="25px" /> : "Log In"}
                        </button>
                    </form>

                    <button onClick={() => {setIsShowPassOpen(!isShowPassOpen)}} 
                                    className={`${isShowPassOpen ? "show-hide-pass" : "show-hide-pass hide"}`}>
                                    <Visibility />
                    </button>
                    <button onClick={() => {setIsShowPassOpen(!isShowPassOpen)}} 
                                    className={`${isShowPassOpen ? "show-hide-pass hide" : "show-hide-pass"}`}>
                                    <VisibilityOff />
                    </button>

                    <a className='forgot-pass' role='button' onClick={() => setIsPop_upForgotPassOpen(true)}><p>Forgot password?</p></a>

                    <hr className='hr-login'></hr>

                    <button className='btn create-acc-btn' onClick={() => {setRegisterOpen(true)}}>Create new account</button>
                </div>

            </main>

            {isRegisterOpen && <Register setRegisterOpen={setRegisterOpen} />}
            {isPop_upForgotPassOpen && <ForgotPassPopUp setIsPop_upForgotPassOpen={setIsPop_upForgotPassOpen} />}
            {isTwoFactorPopUpOpen && <LoginTFA user={user} dispatch={dispatch} setTwoFactorPopUpOpen={setTwoFactorPopUpOpen} />}
        </>

    )

}

export default Login;

