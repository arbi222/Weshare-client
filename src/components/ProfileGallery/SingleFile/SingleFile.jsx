import React, { useEffect, useState , useRef} from 'react'
import "./singleFile.css"
import { Edit , Delete, AccountCircle, Panorama, PlayCircleOutline } from "@mui/icons-material";
import { toast } from 'react-toastify';
import deleteFileByURL from '../../../lib/deleteFile';

const SingleFile = ({image, video, user, loggedInUser, accessToken, axiosJWT, setOpenMediaViwerValue, setMediaViwer}) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [settingsBtnOn, setSettingsBtnOn] = useState(false);
    const photoSettingsbtn = useRef()

    useEffect(() => {
        if (settingsBtnOn){
          const handleMoreButtons = (e) => {
            if (!photoSettingsbtn.current.contains(e.target)){
                setSettingsBtnOn(false);
            }
          }
      
          document.addEventListener("mousedown", handleMoreButtons);
    
          return () => {
            document.removeEventListener("mousedown", handleMoreButtons);
          }
        }
    })

    const handleProfilePic = async () => {
        const updateUser = {
            userId: loggedInUser._id,
            profilePicture: image
        }
        const thePost = {
            userId: loggedInUser._id,
            updateProfile: true,
            image: image,
            fileType: "image"
        }
        try{
            await axiosJWT.post(apiUrl + "/posts", thePost , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            });
            await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            });
            window.location.reload()
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }

    const handleCoverPic = async () => {
        const updateUser = {
            userId: loggedInUser._id,
            coverPicture: image
        }
        const thePost = {
            userId: loggedInUser._id,
            updateCover: true,
            image: image,
            fileType: "image"
        }
        try{
            await axiosJWT.post(apiUrl + "/posts", thePost , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            });
            await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
              });
            window.location.reload()
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
    }

    const handleDeleteFile = async () => {
        const data = {
            userId: loggedInUser._id,
            file: image ? image : video,
            fileType: image ? "image" : "video"
        }
        try{
            await deleteFileByURL(data.file);
            await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/removeFromGallery", data , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
              })
            window.location.reload()
        }
        catch(err){
            toast.error("Error! Could not delete the selected file!")
        }
    }

  return (
    <div ref={photoSettingsbtn}>

        {image ? 
            <img className='photo-style' 
                src={image}
                alt='Photo'
                onClick={() => {setMediaViwer({fileUrl: image, fileType: "image"})
                                setOpenMediaViwerValue(true)}} 
            />
        :
            <div className='video-style' onClick={() => {setMediaViwer({fileUrl: video, fileType: "video"})
                                                        setOpenMediaViwerValue(true)}}>
                <span>
                    <PlayCircleOutline style={{marginTop: "3px", fontSize: "60px"}}/>
                </span>
                <video className='photo-style' src={video} alt="video"></video>
            </div>
        }
        
        {loggedInUser._id === user._id &&
            <button className='btn photo-settings-btn' onClick={() => setSettingsBtnOn(!settingsBtnOn)}>
                <span >
                    <Edit style={{width: "20px", height: "20px", marginTop: "2px"}}/>
                </span>
            </button>
        }
        
        {settingsBtnOn && 
            <div className='photo-settings-pop-up shadow'>
                {image &&
                    <>
                        <button className='btn photo-settings-btns' onClick={handleProfilePic}>
                            <span>
                                <AccountCircle style={{marginTop: "3px"}}/>
                            </span>
                            <p>Make profile picture</p>
                        </button>

                        <button className='btn photo-settings-btns' onClick={handleCoverPic}>
                            <span>
                                <Panorama style={{marginTop: "3px"}}/>
                            </span>
                            <p>Make cover photo</p>
                        </button>
                    </>
                }
                
                <button className='btn photo-settings-btns' onClick={handleDeleteFile}>
                    <span>
                        <Delete style={{marginTop: "3px"}}/>
                    </span>
                    <p>{image ? "Delete photo" : "Delete video"}</p>
                </button>   
            </div>
        }
                   
    </div>
  )
}

export default SingleFile;