import { createContext, useReducer , useState, useRef, useEffect} from "react"
import AuthReducer from "./AuthReducer";
import Cookies from 'js-cookie'
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {io} from "socket.io-client";
import { toast } from 'react-toastify'


const INITIAL_STATE = {
    user: null,
    accessToken: Cookies.get('accessToken') || null,
    askingForTwoFaCode: false,
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const refreshToken = async () => {
        try{
            const res = await axios.post(apiUrl + "/auth/refreshToken", {}, {withCredentials: true});
            Cookies.set("accessToken", res.data.accessToken, {
                secure: true,
                sameSite: "strict",
                path: "/"
            })
            dispatch({type: "REFRESHING_TOKEN", payload: {accessToken: res.data.accessToken}})
        
            return res.data;
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
        
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            let currentDate = new Date();
            const decodedToken = jwtDecode(state.accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()){
                const data = await refreshToken();
                config.headers["authorization"] = "Bearer " + data.accessToken;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    useEffect(() => {
        if (state.accessToken){
            fetchUserData(state.accessToken)
                .then(userData => {
                    dispatch({type: "LOGIN_SUCCESS", payload: {userInfo: userData, accessToken: state.accessToken}});
                })
                .catch(err => {
                    toast.error("Error! Something went wrong!")
                    dispatch({type: "LOGOUT"})
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        else{
            setLoading(false)
        }
    },[])

    const fetchUserData = async (accessToken) => {

        const decodedAccessToken = jwtDecode(accessToken);

        try{
            const res = await axiosJWT.get(`${apiUrl}/users/getUser/${decodedAccessToken.id}/` + decodedAccessToken.id, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            return res.data;
        }
        catch(err){
            toast.error("Error! Could not get the user!")
        }
    }

    const [openAlert, setOpenAlert] = useState(false);
    const [mediaViwer, setMediaViwer] = useState({fileUrl: null, fileType: ""});
    const [openMediaViwerValue, setOpenMediaViwerValue] = useState(false);
    const [isPop_upSharePostOpen, setIsPop_upSharePostOpen] = useState(false)
    const [deletePostPopUp, setDeletePostPopUp] = useState(false);
    const [isPop_upCommentOpen, setIsPop_upCommentOpen] = useState(false)
    const [isLikesPopUpOpen, setLikesPopUpOpen] = useState(false)

    const socket = useRef()
    if (state.user && state.accessToken){
        socket.current = io(process.env.REACT_APP_SOCKET_URL);
        socket.current.emit("addUser", state.user._id)
    }


    return (
        <AuthContext.Provider 
            value={{
                user: state.user,
                accessToken: state.accessToken,
                askingForTwoFaCode: state.askingForTwoFaCode,
                loading, 
                axiosJWT,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
                socket,
                isPop_upSharePostOpen, setIsPop_upSharePostOpen,
                isPop_upCommentOpen, setIsPop_upCommentOpen,
                deletePostPopUp, setDeletePostPopUp,
                isLikesPopUpOpen, setLikesPopUpOpen,
                openAlert, setOpenAlert,
                mediaViwer, setMediaViwer,
                openMediaViwerValue, setOpenMediaViwerValue,
                }}
        >
        {children}
        </AuthContext.Provider>
    )
}