import React, { useState, useEffect, useContext} from 'react'
import "./notifications.css"
import {Delete} from "@mui/icons-material"
import { Link } from 'react-router-dom';
import { format } from "timeago.js"
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Notifications = ({notification,setDeletedSingleNotification, setUnReadNotifications}) => {

  const { user: loggedInUser, accessToken, axiosJWT } = useContext(AuthContext);

  const [notificationAuthor, setNotificationAuthor] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const [hover, setHover] = useState(false)
  const [notificationRead, setNotificationRead] = useState(notification.read)

  useEffect(() => {
    const getNotificationAuthor = async () =>{
      try{
        const res = await axiosJWT.get(`${apiUrl}/users/getUser/${notification.authorId}/` + loggedInUser._id, {
          headers: {
              authorization: `Bearer ${accessToken}`
          }
        });
        setNotificationAuthor(res.data);
      }
      catch(err){
        toast.error("Error! Could not get the notification's owner!")
      }
    }
    getNotificationAuthor()
  },[notification])

  const [deleted, setDeleted] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try{
      setDeletedSingleNotification(true);
      await axiosJWT.delete(apiUrl + "/notifications/" + notification._id, {data: {userId: loggedInUser._id}, headers: {authorization: `Bearer ${accessToken}`}});
      setDeletedSingleNotification(false);
    }
    catch(err){
      toast.error("Error! Could not delete the notification!")
    }
  }

  const handleReading = async () => {
    try{
      const updatedNotification = {
        receiverId: loggedInUser._id,
        read: true
      }

      await axiosJWT.put(apiUrl + "/notifications/" + notification._id, updatedNotification , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
      });
      setNotificationRead(true);
      setUnReadNotifications((prev) => prev - 1)
    }
    catch(err){
      toast.error("Error! Something went wrong!")
    }
  }

  return (
    
    <>
        {notification.postId ? 
            notificationAuthor !== null && 
              <div className={deleted ? 'notification-container delete-notification-animation' : 'notification-container'}
                  onMouseOver={() => setHover(true)} 
                  onMouseOut={() => setHover(false)}>
                <Link className='link-notification' referrerPolicy='no-referrer' to={"/post/" + notification.postId} onClick={handleReading}>
                  <div className='notification-item'>
                    <img className="profile-pic-notification" 
                        src={(notificationAuthor !== "blockedByYou" && notificationAuthor !== "blockedByThem") ?
                                notificationAuthor.profilePicture ? notificationAuthor.profilePicture : 
                                  notificationAuthor.gender === "Male" ? 
                                    "/assets/person/male.jpg" :
                                    "/assets/person/female.jpg"
                            :
                            "/assets/person/blockedUser.png"
                        } 
                    />
                    <div className='notification-details'>
                      <p className={!notificationRead ? "unread-notification" : undefined}>{notification.content}</p>
                      <span>{format(notification.createdAt)}</span>
                    </div>
                  </div>
                </Link>
                <div className='notification-options'>
                  <div className={!hover ? "hide" : undefined}>
                    <form onSubmit={handleDelete}>
                      <button title='Delete notification' 
                              type='submit'
                              className='btn delete-notification-btn shadow'
                              onClick={() => setDeleted(true)}>
                        <Delete style={{marginTop: "3px"}}/>
                      </button>
                    </form>
                  </div>
                  {!notificationRead &&
                    <button title='Mark as read' onClick={handleReading} className='blue-dot shadow'></button>
                  }
                </div>  
              </div>

              :

              <>
                {notificationAuthor !== null &&
                  <div className={deleted ? 'notification-container delete-notification-animation' : 'notification-container'} 
                        onMouseOver={() => setHover(true)} 
                        onMouseOut={() => setHover(false)}>
                    <a className='link-notification' href={"/profile/" + notification.authorId} onClick={handleReading}>
                      <div className='notification-item' >
                        <img className="profile-pic-notification" 
                            src={(notificationAuthor !== "blockedByYou" && notificationAuthor !== "blockedByThem") ?
                                  notificationAuthor.profilePicture ? notificationAuthor.profilePicture : 
                                    notificationAuthor.gender === "Male" ? 
                                      "/assets/person/male.jpg" :
                                      "/assets/person/female.jpg"
                              :
                              "/assets/person/blockedUser.png"
                            } 
                        />
                        <div className='notification-details'>
                          <p className={!notificationRead ? "unread-notification" : undefined}>{notification.content}</p>
                          <span>{format(notification.createdAt)}</span>
                        </div>
                      </div>
                    </a>
                    <div className='notification-options'>
                      <div className={!hover ? "hide" : undefined}>
                        <form onSubmit={handleDelete}>
                          <button title='Delete notification' 
                                  type='submit'
                                  className='btn delete-notification-btn shadow'
                                  onClick={() => setDeleted(true)}>
                            <Delete style={{marginTop: "3px"}}/>
                          </button>
                        </form>
                      </div>
                      {!notificationRead &&
                        <button title='Mark as read' onClick={handleReading} className='blue-dot shadow'></button>
                      }
                    </div>
                  </div>
                }
              </>
        } 
    </>
  )
}

export default Notifications;