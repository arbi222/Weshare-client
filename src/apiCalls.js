import axios from "axios"
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'

export const loginCall = async (userCredentials, dispatch) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    dispatch({type: "LOGIN_START"});

    try{
        const res = await axios.post(apiUrl + "/auth/login", userCredentials, {
            withCredentials: true
        });
        if (res.data.userInfo.isTwoFactorAuthOn){
            try{
                const response = await axios.post(apiUrl + "/twoFactor/sendEmailLoginCode", {email: res.data.userInfo.username});
                dispatch({type: "VERIFY_2FA", payload: {user: res.data.userInfo, askingForTwoFaCode: true}});
                toast.success(response.data);
            }
            catch(err){
                dispatch({type: "LOGIN_FAILURE", payload: err});
                toast.error(err.response.data)
            }
        }
        else{
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            Cookies.set("accessToken", res.data.accessToken, {
                secure: true,
                sameSite: "strict",
                path: "/"
            })
            toast.success("Logged in successfully!")
        } 
    }
    catch(err){
        dispatch({type: "LOGIN_FAILURE", payload: err});
        if (err.response.status === 401){
            toast.error("Wrong password!")
        }
        else if(err.response.status === 404){
            toast.error(err.response.data)
        }
    }
}

export const logoutCall = async (dispatch) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try{
        const res = await axios.get(apiUrl + "/auth/logout");
        if (res.status === 200){
            dispatch({type: "LOGOUT"});
            Cookies.remove("accessToken");
            window.location.href = "/login"
        }
    }
    catch(err){
        console.log(err);
    }
}