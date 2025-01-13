import React, { useState , useEffect } from 'react'
import "./notificationBtn.css"
import { ClearAll , PlaylistAddCheck} from "@mui/icons-material"
import Notifications from '../Notifications/Notifications';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'

const NotificationBtn = ({notifications,loggedInUser, setUnReadNotifications, setDeletedSingleNotification, setNotificationChanges, accessToken, axiosJWT}) => {

  const [loader, setLoader] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1000)
  },[])

  const handleDelete = async () => {
    try{
      setNotificationChanges(true)
      await axiosJWT.delete(apiUrl + "/notifications/deleteall/" + loggedInUser._id, {data: {userId: loggedInUser._id}, headers: {authorization: `Bearer ${accessToken}`}});
      setNotificationChanges(false)
    }
    catch(err){
      toast.error("Error! Could not delete the notifications!")
    }
  }


  const handleReadAll = async () => {
    try{
      setNotificationChanges(true)
      setLoader(true)
      await axiosJWT.put(apiUrl + "/notifications/updateall/" + loggedInUser._id, {receiverId: loggedInUser._id} , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
      });
      setNotificationChanges(false)
      setTimeout(() => {
        setLoader(false)
      }, 1000)
    }
    catch(err){
      toast.error("Error! Something went wrong!")
      setLoader(false)
    }
  }

  return (
        
    <>
        <div className="notification-dropdown scroll-bar shadow">

          <div className='notification-top'> 
            <h2 className='notification-header'>Notifications</h2>

            {notifications.length > 0 && 
              <div className='clearAllBtn-section'>
                <button title='Mark all as read' 
                        className='btn clearAllBtn'
                        onClick={handleReadAll}>
                  <PlaylistAddCheck style={{marginTop:"2px"}}/>
                </button>
                <button title='Clear all notifications' 
                        className='btn clearAllBtn'
                        onClick={handleDelete}>
                  <ClearAll style={{marginTop:"2px"}}/>
                </button>
              </div>
            }
          </div>
          

          <div className='notification-components'>

          {loader ? 
              <div className='notification-loader-container'>
                <CircularProgress size="30px" className="notification-loader" />
              </div>
            :
            notifications?.length !== 0 ? 

              notifications.map((notification) => (
                <Notifications key={notification._id} 
                                notification={notification}
                                setUnReadNotifications={setUnReadNotifications}
                                setDeletedSingleNotification={setDeletedSingleNotification}
                                loggedInUser={loggedInUser}
                                accessToken={loggedInUser}
                                axiosJWT={axiosJWT}
                                />
              ))

            :

              <div className='no-notification'>
                  <span>You don't have any notifications.</span>
              </div>     

          }
  
          </div>

        </div>
    </>
  )
}

export default NotificationBtn;