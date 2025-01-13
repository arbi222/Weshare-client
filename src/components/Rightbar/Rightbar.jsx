import React, { useContext , useEffect, useState} from 'react'
import "./rightbar.css"
import ChatOnline from '../chatOnline/ChatOnline';
import { Search } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify';

const Rightbar = () => {

    const {user, socket, axiosJWT, accessToken, 
        openMediaViwerValue, isPop_upSharePostOpen, 
        isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, 
        openAlert} = useContext(AuthContext);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userFriends, setUserFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            try{
                const res = await axiosJWT.get(apiUrl + "/users/friends/" + user._id, {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                })
                setUserFriends(res.data);
            }
            catch(err){
                toast.error("Error! Could not get the friends!")
            }
        }
        getFriends();
    }, [user])

    useEffect(() => {
        const handleGetUsers = (users) => {
            try {
                setOnlineUsers(
                    user.friends.filter((friendId) =>
                        users.some((usr) => usr.userId === friendId)
                    )
                );
            } catch (err) {
                console.log(err);
            }
        };
    
        socket.current.on("getUsers", handleGetUsers);
    
        return () => {
            socket.current.off("getUsers", handleGetUsers);
        };
    }, [user, user.friends, socket.current]);

    const [blur, setBlur] = useState(false)
    useEffect(() => {
        if (openMediaViwerValue || isPop_upSharePostOpen || isPop_upCommentOpen ||
            deletePostPopUp || isLikesPopUpOpen || openAlert) {
            setBlur(true);
        }
        else{
            setBlur(false);
        }
    }, [openMediaViwerValue, isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, openAlert])

    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className={blur ? 'rightbar blur-background' : 'rightbar'}>
            <div className="rightbar-wrapper">
                <h4 className="rightbar-title">Friends</h4>
                <div className='name-filter'>
                    <label htmlFor='input-filter'>
                        <Search style={{marginTop: "3px"}}/>
                    </label>
                    <input type="text" 
                           id='input-filter' 
                           placeholder='Search for a friend...' 
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <div className="rightbar-friend-list rightbar-scroll-bar">
                    <ChatOnline userFriends={userFriends} onlineFriends={onlineUsers} searchTerm={searchTerm} />
                </div>
            </div>
        </div>
  )
}

export default Rightbar;