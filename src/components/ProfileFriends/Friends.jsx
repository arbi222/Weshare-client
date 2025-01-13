import React, { useEffect, useState } from 'react'
import "./friends.css"
import FriendManagement from '../FriendManagement/FriendManagement';
import { toast } from 'react-toastify';

const Friends = ({user, loggedInUser, accessToken, axiosJWT, openMediaViwerValue}) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [friends, setFriends] = useState([])

    const [friendRequestSent, setFriendRequestSent] = useState(false);

    useEffect(() => {
        const getFriends = async () => {
            try{
                const friendList = await axiosJWT.get(apiUrl + "/users/friends/" + user._id , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                });
                setFriends(friendList.data);
            }
            catch(err){
                toast.error("Error! Could not get friends!")
            }
        }
        getFriends();
    },[user._id, friendRequestSent])

  return (
    <>
        <main className={openMediaViwerValue ? 'friends-section shadow blur-background' : 'friends-section shadow'}>

            {loggedInUser._id === user._id ?
                <h2>Friends ({user.friends.length})</h2>
                :
                <h2>{user.firstName}'s Friends ({user.friends.length})</h2>
            }
            
            <hr className='friends-hr'></hr>

            {user.friends.length !== 0 ?
                <div className='friends-pattern'>
                    {friends.map(friend => {
                        if (loggedInUser.blockList.includes(friend._id) || friend?.blockList.includes(loggedInUser._id)){
                            return;
                        }
                        else{
                            return (
                                <div key={friend._id} className='friend-desc'>
                                    <a href={"/profile/" + friend._id} referrerPolicy='no-referrer' className='friend-link'> 
                                        <div>
                                            <img 
                                                className='friends-img' 
                                                src={friend.profilePicture ? friend.profilePicture :
                                                        friend.gender === "Male" ? 
                                                            "/assets/person/male.jpg" :
                                                            "/assets/person/female.jpg"
                                                    }
                                                alt='Profile photo' />
                                            <h4>{friend.firstName + " " + friend.middleName + " " + friend.lastName}</h4>
                                        </div>
                                    </a>
    
                                    <FriendManagement friend={friend} setFriendRequestSent={setFriendRequestSent}/>
                                </div>
                            )
                        }
                    })}
                </div>
            :
                <div className='no-friends'>
                    <h4>Your friend list is empty!</h4>
                </div>

            }

        </main>
    </>
  )
}

export default Friends;