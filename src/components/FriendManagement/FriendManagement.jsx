import React, { useContext } from 'react'
import "./friendManagement.css"
import { PersonAdd , Delete , Done, Close, Send, Message } from "@mui/icons-material";
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext';

const FriendManagement = ({friend, setFriendRequestSent}) => {

    const { user: loggedInUser, dispatch, socket, accessToken, axiosJWT } = useContext(AuthContext);

    const apiUrl = process.env.REACT_APP_API_URL;

    const sendFriendRequest = async (friendId) => {
        try{
            const notification = {
                authorId: loggedInUser._id, 
                receiverId: friendId,
                friendRequest: true,
                content: loggedInUser.firstName + " " + loggedInUser.middleName + " " + loggedInUser.lastName + " has sent you a friend request."
            }
      
            await axiosJWT.put(apiUrl + "/users/" + friendId + "/friendRequest", {userId: loggedInUser._id} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
            });
            await axiosJWT.post(apiUrl + "/notifications/", notification , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
            })
            socket.current.emit("sendNotification", notification);
            setFriendRequestSent(true);
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }

    const cancelFriendRequest = async (friendId) => {
        setFriendRequestSent(true); // this is set to true here and then set back to false below in order to update the state so the users get fetched again
        try{
            const notification = {
                authorId: loggedInUser._id, 
                receiverId: friendId,
                friendRequest: true,
            }

            await axiosJWT.put(apiUrl + "/users/" + friendId + "/cancelFriendRequest", {userId: loggedInUser._id} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
            });

            await axiosJWT.delete(apiUrl + "/notifications/" + notification.friendRequest + "/unlike/" + loggedInUser._id, 
                {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }}
            );
            socket.current.emit("removeNotification", notification);
            setFriendRequestSent(false);
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }

    const acceptFriendRequestHandle = async (friendId) => {
        try{
          const notification = {
            authorId: loggedInUser._id, 
            receiverId: friendId,
            content: loggedInUser.firstName + " " + loggedInUser.middleName + " " + loggedInUser.lastName + " has accepted your friend request."
          }
      
          await axiosJWT.put(apiUrl + "/users/" + friendId + "/addfriend", {userId: loggedInUser._id} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
          });
          await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/cancelFriendRequest", {userId: friendId} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
          });
          dispatch({type: "ADDFRIEND", payload: friendId})
          await axiosJWT.post(apiUrl + "/notifications/", notification , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
          })
          socket.current.emit("sendNotification", notification);
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }

    const declineFriendRequestHandle = async (friendId) => {
        try{
          await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/cancelFriendRequest", {userId: friendId} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
          });
          dispatch({type: "DECLINEFRIENDREQUEST", payload: friendId})
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }

    const deleteFriend = async (friendId) => {
        try{
            await axiosJWT.put(apiUrl + "/users/" + friendId + "/removefriend", {userId: loggedInUser._id} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
            });
            dispatch({type: "REMOVEFRIEND", payload: friendId})
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }


    return <>
        
        {(() => {
            if (loggedInUser.friends.includes(friend?._id)){
                return (
                    <div className='message-remove-section'>
                        <a  href={`https://wesharemessenger.onrender.com/?user=${friend?._id}`}  
                            title='Message'
                            target='_blank'
                            referrerPolicy='no-referrer'
                            className='message-link add-btn-icon'>
                            <Message style={{marginTop:"3px"}}/>
                        </a>
                        <button title='Remove friend' 
                                onClick={() => {deleteFriend(friend?._id)}} 
                                className='friends-add-remove-btn'>
                            <Delete className='delete-btn-icon' />
                        </button>
                    </div>
                )
            }
            else{
                if (friend?._id !== loggedInUser._id){
                    if (loggedInUser.friendRequests.includes(friend?._id)){
                        return (
                            <div className='accept-decline-btns'>
                                <button title='Accept friend request' 
                                        className='friends-add-remove-btn'
                                        onClick={() => {acceptFriendRequestHandle(friend?._id)}}>
                                  <Done className='add-btn-icon' />
                                </button>
                                <button title='Decline friend request' 
                                        className='friends-add-remove-btn'
                                        onClick={() => {declineFriendRequestHandle(friend?._id)}}>
                                  <Close className='delete-btn-icon' />
                                </button> 
                            </div>
                        )
                    }
                    else if (friend?.friendRequests.includes(loggedInUser._id)){
                        return (
                            <button title="Cancel friend request" 
                                    className='friends-add-remove-btn'
                                    onClick={() => {cancelFriendRequest(friend?._id)}}>
                                <Send className='add-btn-icon' />
                            </button>
                        )
                    }
                    else{
                        return (
                            <button title='Add friend' 
                                    onClick={() => {sendFriendRequest(friend?._id)}} 
                                    className='friends-add-remove-btn'>
                                <PersonAdd className='add-btn-icon' />
                            </button>
                        )
                    }
                    
                }
            }
        })()}

    </>

}

export default FriendManagement;
