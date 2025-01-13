import React, { useState , useEffect} from 'react'
import "./likes.css"
import FriendManagement from '../FriendManagement/FriendManagement'
import { toast } from 'react-toastify'


const Likes = ({likeOwnerId, accessToken, axiosJWT, loggedInUser}) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [likeOwner, setLikeOwner] = useState(null);

    const [friendRequestSent, setFriendRequestSent] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const res = await axiosJWT.get(`${apiUrl}/users/getUser/${likeOwnerId}/` + loggedInUser._id, {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                  });
                setLikeOwner(res.data)
            }
            catch(err){
                toast.error("Error! Could not get the like's author!")
            }
        }
        fetchUser();
    }, [likeOwnerId, friendRequestSent])


    return <>
        {likeOwner &&
        <div className='likes-section'>
            <div className='like-section-pattern'>
                <a href={(likeOwner !== "blockedByYou" && likeOwner !== "blockedByThem") && '/profile/' + likeOwnerId} 
                    className='like-owner-link'
                    referrerPolicy='no-referrer'>
                    <img className='like-profile-pic' 
                        src={(likeOwner !== "blockedByYou" && likeOwner !== "blockedByThem") ? 
                            likeOwner?.profilePicture ? likeOwner?.profilePicture :
                                likeOwner?.gender === "Male" ? 
                                "/assets/person/male.jpg" :
                                "/assets/person/female.jpg"
                                :
                                "/assets/person/blockedUser.png"
                            }
                        alt='profile pic'
                    />
                    <p>{(likeOwner !== "blockedByYou" && likeOwner !== "blockedByThem") ? 
                            likeOwner?.firstName + " " + likeOwner?.middleName + " " + likeOwner?.lastName
                            :
                            "User"
                        }
                    </p>
                </a>
                
                {(likeOwner !== "blockedByYou" && likeOwner !== "blockedByThem") &&
                    <FriendManagement setFriendRequestSent={setFriendRequestSent} friend={likeOwner}/>
                }
            </div> 
        </div>
        }
    </>

}

export default Likes;