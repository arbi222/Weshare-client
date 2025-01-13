import React from 'react'
import "./blockedUser.css"
import { toast } from 'react-toastify'

const BlockedUser = ({loggedInUser, dispatch, accessToken, axiosJWT, socket, blockedUser}) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleUnBlocking = async (e) => {
        e.preventDefault();
    
        try{
          const res = await axiosJWT.put(apiUrl + "/users/" + blockedUser._id + "/blockUnblockUser", {userId: loggedInUser._id} , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
          });
          socket.current.emit("unBlockUser", {
            currentUserId: loggedInUser._id,
            theBlockedOneId: blockedUser._id
          })
          toast.success(res.data);
          dispatch({type: "UNBLOCKUSER", payload: blockedUser._id});
        }
        catch(err){
          toast.error(err.response.data);
        }
    }

  return (
    <>  
        {blockedUser &&
            <div className='blocked-user'>
                <div className='blocked-user-details'>
                    <img src={blockedUser?.profilePicture ? blockedUser?.profilePicture : 
                                  blockedUser?.gender === "Male" ? 
                                  "/assets/person/male.jpg" :
                                  "/assets/person/female.jpg"
                            }  
                        className='blocked-user-profile-photo' />
                    <h4>{blockedUser?.firstName + " " + blockedUser?.middleName + " " + blockedUser?.lastName}</h4>
                </div>    
                <div>
                    <form onSubmit={handleUnBlocking}>
                        <button className='btn unblock-btn'>Unblock</button>
                    </form>
                </div>
            </div>
        }
    </>
  )
}

export default BlockedUser;