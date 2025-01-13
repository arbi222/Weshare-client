import React, {useContext, useState, useRef, useEffect} from 'react'
import "./settings.css"
import { Link } from "react-router-dom";
import Navbar from '../../components/Navbar/Navbar'
import { AuthContext } from '../../context/AuthContext';
import upload from '../../lib/upload';
import { toast } from 'react-toastify';
import MediaViwer from '../../pop-ups/mediaViwer/MediaViwer';


const Settings = () => {

    const { user: loggedInUser, accessToken, axiosJWT, mediaViwer, setMediaViwer, openMediaViwerValue, setOpenMediaViwerValue } = useContext(AuthContext);
    const apiUrl = process.env.REACT_APP_API_URL;
    const photo = loggedInUser.profilePicture ? loggedInUser.profilePicture :   
                  loggedInUser.gender === "Male" ? 
                  "/assets/person/male.jpg" :
                  "/assets/person/female.jpg"

    const [newPhoto, setNewPhoto] = useState({
        file: null,
        url: ""
    })  
    const photoHandler=(e)=>{
      if (e.target.files.length !== 0){
        setNewPhoto({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
      }
    }

    const [removeFile, setRemoveFile] = useState(null);   
    const handleRemovePhoto = () => {
        setRemoveFile(loggedInUser.gender === "Male" ? "/assets/person/male.jpg" : "/assets/person/female.jpg");
        setNewPhoto({
            file: null,
            url: ""
        })
    }

    const cancelButton = () => {
        setNewPhoto({file: null, url: ""})
        document.getElementById("profile-pic").value = null;
    }

    const firstName = useRef();
    const lastName = useRef();
    const middleName = useRef()
    const age = useRef()


    const [isChecked, setIsChecked] = useState(true)

    const checkHandler = () => {
        setIsChecked(!isChecked);
    }

    const updateMainSettings = async (e) => {
        e.preventDefault();

        const updateUser = {
            userId: loggedInUser._id,
            firstName: firstName.current.value.charAt(0).toUpperCase() + firstName.current.value.slice(1),
            lastName: lastName.current.value.charAt(0).toUpperCase() + lastName.current.value.slice(1),
            middleName: middleName.current.value.charAt(0).toUpperCase() + middleName.current.value.slice(1),
            age: age.current.value,
        }

        if (newPhoto.file){
            const imgUrl = await upload(newPhoto.file)

            updateUser.profilePicture = imgUrl;

            try{
                await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/addToGallery", {userId: loggedInUser._id, file: imgUrl, fileType: "image"} , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                })
                if (isChecked){
                    const thePost = {
                        userId: loggedInUser._id,
                        updateProfile: true,
                        image: imgUrl,
                        fileType: "image"
                    }
                    await axiosJWT.post(apiUrl + "/posts", thePost, {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                    });
                }
            }
            catch(err){
                toast.error("Error! Something went wrong!")
            }
        }
        else{
            if (removeFile !== null){
                updateUser.profilePicture = "";
            }
            else{
                updateUser.profilePicture = loggedInUser.profilePicture ? loggedInUser.profilePicture : "";
            }
        }
        try{
            await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
              })
            toast.success("Settings saved!")
        }
        catch(err){
            toast.error("Settings were not saved!")
        }
    }

    useEffect(() => {
        const handleKeydown = (objEvent) => {
          if (objEvent.isComposing || objEvent.keyCode === 9) {
            objEvent.preventDefault();
          }
        };
      
        if (openMediaViwerValue) {
          document.body.style.overflow = 'hidden';
          document.body.addEventListener("keydown", handleKeydown);
        } else {
          document.body.style.overflow = 'unset'; 
        }
      
        return () => {
          document.body.style.overflow = 'unset'; 
          document.body.removeEventListener("keydown", handleKeydown); 
        };
      }, [openMediaViwerValue]);

  return (
    <>
        <Navbar />
        <div className={openMediaViwerValue ? 'settings-container shadow blur-background' : 'settings-container shadow'}>

            <h1 className='setting-header'>Settings</h1>

            <form onSubmit={updateMainSettings}>
                <div className='settings-sections'>

                    <div className='profile-picture-section shadow'>

                        <img src={newPhoto.url ? newPhoto.url :
                                  removeFile ? removeFile :
                                  photo
                            } 
                            className={loggedInUser.profilePicture ? 'change-profile-picture change-profile-picture-cursor' : 'change-profile-picture'}
                            alt='profile photo'
                            onClick={() => {loggedInUser.profilePicture && setMediaViwer({fileUrl: loggedInUser.profilePicture, fileType: "image"})
                                                                            setOpenMediaViwerValue(true)}}
                        />

                        <input id='profile-pic' 
                            className='hide' 
                            type='file' 
                            accept="image/*,image/heif,image/heic"
                            onChange={photoHandler}
                            > 
                        </input>

                        {newPhoto.file ? 
                        <>
                            <button type='button' className='btn upload-pic-btn cancel-btn' onClick={cancelButton}>Cancel</button>
                            <div className='share-post-checkbox'>
                                <label htmlFor='share-post'>Share post?</label>
                                <label className='switch'>
                                    <input type="checkbox" id='share-post' checked={isChecked} onChange={checkHandler}/>
                                    <span className='slider'></span>
                                </label>
                            </div>
                        </>
                        :   
                            <>
                                {loggedInUser.profilePicture ? 
                                    removeFile === null ?
                                        <div className='upload-remove-pic'>
                                            <label htmlFor="profile-pic" className='upload-pic-btn'>Change profile photo</label>
                                            <button type='button' className='remove-btn upload-pic-btn' onClick={handleRemovePhoto}>Remove profile photo</button>
                                        </div>
                                        :
                                        <label htmlFor="profile-pic" className='upload-pic-btn'>Add profile photo</label>
                                    :
                                    <label htmlFor="profile-pic" className='upload-pic-btn'>Add profile photo</label>
                                }
                            </>
                        }
                        
                    </div>

                    <div className='user-info shadow'>
                        <div className='primary-info'>
                            <div className='input-settings-info'>
                                <label className='label-input' htmlFor='first-name'>First Name</label>
                                <input id='first-name' 
                                        type='text' 
                                        placeholder='Enter your name'
                                        defaultValue={loggedInUser.firstName}
                                        ref={firstName}
                                        >
                                </input>
                            </div>

                            <div className='input-settings-info'>
                                <label className='label-input' htmlFor='middle-name'>Middle Name</label>
                                <input id='middle-name' 
                                        type='text' 
                                        placeholder='Enter your middle name'
                                        defaultValue={loggedInUser.middleName}
                                        ref={middleName}
                                        >
                                </input>
                            </div>

                            <div className='input-settings-info'>
                                <label className='label-input' htmlFor='last-name'>Last Name</label>
                                <input id='last-name' 
                                        type='text' 
                                        placeholder='Enter your last name'
                                        defaultValue={loggedInUser.lastName}
                                        ref={lastName}
                                        >
                                </input>
                            </div>

                            <div className='input-settings-info'>
                                <label className='label-input' htmlFor='age'>Age</label>
                                <input id='age' 
                                        defaultValue={loggedInUser.age}  
                                        type='number' min="16" 
                                        placeholder='Enter your age'
                                        ref={age}
                                        >
                                </input>
                            </div>

                            <button type='submit' className='btn' id='submit-btn'>Save Changes</button>
                        </div>

                        <div className='advanced-setting-links'>
                            <Link className='link' to="/settings/basic-info" referrerPolicy='no-referrer'>
                                <span>Edit Basic Info</span>
                            </Link>
                            <Link className='link' to="/settings/advanced" referrerPolicy='no-referrer'>
                                <span>Advanced Settings</span>
                            </Link>
                            <Link className='link' to="/settings/blocklist" referrerPolicy='no-referrer'>
                                <span>Manage Blocklist</span>
                            </Link>
                        </div> 
                    </div>

                </div>
            </form>
            
        </div>

        {openMediaViwerValue &&
            <MediaViwer mediaViwer={mediaViwer} setOpenMediaViwerValue={setOpenMediaViwerValue} />
        }

    </>
  )
}

export default Settings;