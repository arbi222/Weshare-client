import React, { useState, useRef, useContext } from 'react'
import "./register.css"
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';
import { toast } from 'react-toastify';

const Register = ({setRegisterOpen}) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const {dispatch} = useContext(AuthContext);

    const firstName = useRef();
    const lastName = useRef();
    const email = useRef();
    const password = useRef();
    const age = useRef();
    const [gender, setGender] = useState("");

    const handleSignUpClick = async (e) => {
        e.preventDefault()
        const user = {
            firstName: firstName.current.value.charAt(0).toUpperCase() + firstName.current.value.slice(1),
            lastName: lastName.current.value.charAt(0).toUpperCase() + lastName.current.value.slice(1),
            username: email.current.value,
            password: password.current.value,
            age: age.current.value,
            gender: gender,
        }
        try{
            await axios.post(apiUrl + "/auth/register", user);
            setRegisterOpen(false);
            loginCall({username: email.current.value, password: password.current.value}, dispatch)
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

  return (
        <>
            <main className='main-register-container pop-up shadow'>
                
                    <div className='register-heading'>
                        <h1>Sign Up</h1>
                        <p>It’s quick and easy.</p>
                        <div className='close-btn-container'>
                            <button className='btn' title='Close' onClick={() => {setRegisterOpen(false)}}>
                                    <Close className='register-close-icon' />
                            </button>
                        </div>
                    </div>
                    <hr className='register-hr'></hr>
                
                    <form className='register-body' onSubmit={handleSignUpClick}>
                        <div className='register-name'>
                            <input className='register-input name-register-css' 
                                    type='text' 
                                    placeholder='First name' 
                                    onInvalid={e => e.target.setCustomValidity("What's your name?")} 
                                    onInput={e => e.target.setCustomValidity('')} 
                                    required
                                    ref={firstName} 
                                    autoFocus>
                            </input>
                            <input className='register-input name-register-css' 
                                   type='text' 
                                   placeholder='Last name' 
                                   onInvalid={e => e.target.setCustomValidity("What's your last name?")} 
                                   onInput={e => e.target.setCustomValidity('')}
                                   ref={lastName} 
                                   required>
                            </input>
                        </div>
                        
                        <div className='register-sensitive'>
                            <input className='register-input' 
                                   type='email' 
                                   placeholder='Email' 
                                   onInvalid={e => e.target.setCustomValidity('You will use this when you log in')} 
                                   onInput={e => e.target.setCustomValidity('')}
                                   ref={email} 
                                   required>
                            </input>
                            <input className='register-input' 
                                   type='password'
                                   minLength="6" 
                                   placeholder='Pasword' 
                                   onInvalid={e => e.target.setCustomValidity('Enter a combination of at least 6 numbers, letters or symbols')} 
                                   onInput={e => e.target.setCustomValidity('')}
                                   ref={password} 
                                   required>
                            </input>
                        </div>
                        <div className='register-body-sections'>
                            <p>Age</p>
                            <input className="register-input age-input" 
                                   type="number"
                                   placeholder='16+'
                                   required
                                   min="16"
                                   max="150"
                                   onInvalid={e => e.target.setCustomValidity('Enter your age. (You should be 16+ years old)')} 
                                   onInput={e => e.target.setCustomValidity('')}
                                   ref={age} 
                                   >
                            </input>
                        </div>
                        <div className='register-body-sections'>
                            <p>Gender</p>
                            <div className='radio-gender-register'> 
                                <div className='gender-register'>
                                    <label className='radio-cursor' htmlFor='female'>Female</label>
                                    <input className='radio-cursor' 
                                           type="radio" 
                                           id='female' 
                                           name="gender" 
                                           value="female"
                                           onInvalid={e => e.target.setCustomValidity('Choose your gender.')} 
                                           onInput={e => e.target.setCustomValidity('')} 
                                           required 
                                           onClick={() => {setGender("Female")}}
                                    /> 
                                </div>
                                
                                <div className='gender-register'>
                                    <label className='radio-cursor' htmlFor='male'>Male</label>
                                    <input className='radio-cursor' 
                                           type="radio" 
                                           id='male' 
                                           name="gender" 
                                           value="male" 
                                           onClick={() => {setGender("Male")}}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className='btn sign-up-btn' type="submit">Sign Up</button>
                    </form>
                
            </main>
        </>
  )
}

export default Register
