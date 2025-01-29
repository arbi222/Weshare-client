import React , {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import "./profile.css"
import Navbar from '../../components/Navbar/Navbar'
import Feed from '../../components/Feed/Feed'
import About from '../../components/About/About';
import Friends from '../../components/ProfileFriends/Friends';
import Gallery from '../../components/ProfileGallery/Gallery';
import { Photo , Edit , Message , People , Add, Done , Close, Delete, Block, Send } from "@mui/icons-material";
import { AuthContext } from '../../context/AuthContext';
import upload from '../../lib/upload';
import { toast } from 'react-toastify';
import MediaViwer from '../../pop-ups/mediaViwer/MediaViwer';


const Profile = () => {

  const userId = useParams().id;

  const {user: loggedInUser, accessToken, axiosJWT, socket, dispatch, isPop_upSharePostOpen , 
              isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, mediaViwer, setMediaViwer,
              openMediaViwerValue, setOpenMediaViwerValue} = useContext(AuthContext);

  const apiUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null)

  const [profilePostsOn, setProfilePostsOn] = useState(true);
  const [profileAboutOn, setProfileAboutOn] = useState(false);
  const [profileFriendsOn, setProfileFriendsOn] = useState(false);
  const [profileGallreyOn, setProfileGallreyOn] = useState(false);

  const [loader, setLoader] = useState(true);

  useEffect(() => {
      const fetchUser = async () => {
        try{
          const res = await axiosJWT.get(`${apiUrl}/users/getUser/${userId}/${loggedInUser._id}`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
          });
          setUser(res.data)
          setLoader(false);
        }
        catch(err){
          toast.error("Error! Could not get the user!")
          setLoader(false);
        }
      }
      fetchUser();
  }, [userId])

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setPhoto] = useState(null)
  useEffect(() => {
      if (!loader) {
        setPhoto(user.coverPicture && user.coverPicture)
        setProfilePicture(user.profilePicture && user.profilePicture)
      }
  }, [user,loader])

  const [isChecked, setIsChecked] = useState(true)
  const [newFile, setNewFile] = useState({
      file: null,
      url: ""
  });
  const photoHandler=(e)=>{
    if (e.target.files.length !== 0){
      setNewFile({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const cancelSettingCoverImg = () => {
    setNewFile({file: null, url: ""})
    document.getElementById("cover-pic").value = null;
  }

  const handleCoverPicture = async (e) => {
    e.preventDefault();

    const updateUser = {
      userId: loggedInUser._id
    }

    try{
      if (newFile.file){
        const imgUrl = await upload(newFile.file)
        updateUser.coverPicture = imgUrl;
  
        if (isChecked){
          const thePost = {
              userId: loggedInUser._id,
              updateCover: true,
              image: imgUrl,
              fileType: "image"
          }
          await axiosJWT.post("/posts", thePost , {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
          });
        }

        await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/addToGallery", {userId: loggedInUser._id, file: imgUrl, fileType: "image"} , {
          headers: {
              authorization: `Bearer ${accessToken}`
          }
        })

        await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
          headers: {
              authorization: `Bearer ${accessToken}`
          }
        })
        window.location.reload();
      }
    }
    catch(err){
      toast.error("Error! Something went wrong!")
    }
  }

  const handleRemoveCover = async () =>{

    const updateUser = {
      userId: loggedInUser._id,
      coverPicture: ""
    }

    try{
      await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
          headers: {
              authorization: `Bearer ${accessToken}`
          }
      })
      window.location.reload();
    }
    catch(err){
      toast.error("Error! Something went wrong!")
    }

  }

  const [isFriend, setIsFriend] = useState(false);
  
  useEffect(() => {
    setIsFriend(loggedInUser.friends.includes(user?._id))
  },[loggedInUser, user])


  const [friendRequestSent, setFriendRequestSent] = useState(false);
  
  useEffect(() => {
    if (user !== "blockedByYou" && user !== "blockedByThem"){
      if (!loader){
        setFriendRequestSent(user?.friendRequests.includes(loggedInUser._id))
      }
    }    
  },[user, loader, loggedInUser])



  const [haveFriendRequest, setHaveFriendRequest] = useState(false);
  
  useEffect(() => {
    setHaveFriendRequest(loggedInUser.friendRequests.includes(user?._id))
  },[loggedInUser,user])


  const addfriendHandle = async () => {
    try{
      if (isFriend){
        await axiosJWT.put(apiUrl + "/users/" + user._id + "/removefriend", {userId: loggedInUser._id} , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
        });
        dispatch({type: "REMOVEFRIEND", payload: user._id})
        setIsFriend(false);
      }
      else{

        if (friendRequestSent) {
          await axiosJWT.put(apiUrl + "/users/" + user._id + "/cancelFriendRequest", {userId: loggedInUser._id} , {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
          });

          const notification = {
            authorId: loggedInUser._id, 
            receiverId: user._id,
            friendRequest: true,
          }

          await axiosJWT.delete(apiUrl + "/notifications/" + notification.friendRequest + "/unlike/" + loggedInUser._id, 
            {
            headers: {
                authorization: `Bearer ${accessToken}`
            }}
          );
          socket.current.emit("removeNotification", notification);
          setFriendRequestSent(false);
        }
        else{
          const notification = {
            authorId: loggedInUser._id, 
            receiverId: user._id,
            friendRequest: true,
            content: loggedInUser.firstName + " " + loggedInUser.middleName + " " + loggedInUser.lastName + " has sent you a friend request."
          }
  
          await axiosJWT.put(apiUrl + "/users/" + user._id + "/friendRequest", {userId: loggedInUser._id} , {
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
      }
    }
    catch(err){
      toast.error(err.response.data);
    }
  }

  const acceptFriendRequestHandle = async () => {
    try{

      const notification = {
        authorId: loggedInUser._id, 
        receiverId: user._id,
        content: loggedInUser.firstName + " " + loggedInUser.middleName + " " + loggedInUser.lastName + " has accepted your friend request."
      }

      await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/cancelFriendRequest", {userId: user._id} , {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
      });
      await axiosJWT.put(apiUrl + "/users/" + user._id + "/addfriend", {userId: loggedInUser._id} , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
      });
      dispatch({type: "ADDFRIEND", payload: user._id})
      await axiosJWT.post(apiUrl + "/notifications/", notification , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
      })
      socket.current.emit("sendNotification", notification);
      setIsFriend(true);
    }
    catch(err){
      toast.error(err.response.data)
    }
  }


  const declineFriendRequestHandle = async () => {
    try{
      await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/cancelFriendRequest", {userId: user._id} , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
      });
      dispatch({type: "DECLINEFRIENDREQUEST", payload: user._id})
    }
    catch(err){
      toast.error(err.response.data)
    }
  }

  const [removeFriend, setRemoveFriend] = useState(false)
  const RemoveFriendActive = () =>{
    if(isFriend){
      setRemoveFriend(true);
    }
    else{
      setRemoveFriend(false);
    }
  }

  const RemoveFriendDeactive = () =>{
    setRemoveFriend(false);
  }


  const handleBlocking = async () => {
    try{
      const res = await axiosJWT.put(apiUrl + "/users/" + user._id + "/blockUnblockUser", {userId: loggedInUser._id} , {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
      });
      socket.current.emit("blockUser", {
        currentUserId: loggedInUser._id,
        theBlockedOneId: user._id
      })
      toast.success(res.data);
      dispatch({type: "BLOCKUSER", payload: user._id});
    }
    catch(err){
      toast.error(err.response.data);
    }
  }

  useEffect(() => {
    const handleKeydown = (objEvent) => {
      if (objEvent.isComposing || objEvent.keyCode === 9) { 
        objEvent.preventDefault();
      }
    };
  
    if (isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp || isLikesPopUpOpen || openMediaViwerValue) {
      document.body.style.overflow = 'hidden'; 
      document.body.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = 'unset';
    }
  
    return () => {
      document.body.style.overflow = 'unset'; 
      document.body.removeEventListener("keydown", handleKeydown); 
    };
  }, [isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, openMediaViwerValue]);

  const [isBlocked, setIsBlocked]= useState(loggedInUser.blockList.includes(userId))

  const [blockedState, setBlockedState] = useState({});
    useEffect(() => {
        const handleBlockedState = (data) => {
          setBlockedState(prevState => ({
            ...prevState,
            [data.theOtherUserId]: data.state
          }));
        }
        const handleUnBlockedState = async (data) => {
          const res = await axiosJWT.get(`${apiUrl}/users/getUser/${data.theOtherUserId}/${loggedInUser._id}`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
          })
          if (userId === res.data?._id){
            setUser(res.data);
          }
          setBlockedState(prevState => ({
            ...prevState,
            [data.theOtherUserId]: ""
          }));
          setIsBlocked(false);
        };
        socket.current.on("getBlockedState", handleBlockedState);
        socket.current.on("getUnBlockedState", handleUnBlockedState);

        return () => {
          socket.current.off("getBlockedState", handleBlockedState);
          socket.current.off("getUnBlockedState", handleUnBlockedState);
        };
    },[socket.current])

    
    useEffect(() => {
      if (user === "blockedByThem"){
        setIsBlocked(true);
      }
    }, [user])

    const [blur, setBlur] = useState(false)
    useEffect(() => {
        if (isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp || isLikesPopUpOpen || openMediaViwerValue) {
            setBlur(true);
        }
        else{
            setBlur(false);
        }
    }, [isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, openMediaViwerValue])

  return (
    <>
        <Navbar />
        {isBlocked || blockedState[userId] ?
          <div className='blocked-user-profile'>
              <img src="/assets/person/blockedUser.png" alt="blocked user" />
              <p>You are not allowed to see anything about this user!</p>
          </div>
        :
          
        !loader && 
        <div className="profile">
            
          <div className={(newFile.url || coverPhoto) ? 'main-profile-container shadow' : 'main-profile-container-no-cover shadow'}>
              <div className={blur ? "blur-background" : undefined}>

                <div className='mini-container'>
                  {(newFile.url || coverPhoto) ? 
                    <img className={coverPhoto ? 'cover-img cover-img-cursor' : 'cover-img'}
                          src={newFile.url ? newFile.url : coverPhoto}
                          onClick={() => {coverPhoto && setMediaViwer({fileUrl: coverPhoto, fileType: "image"})
                                                        setOpenMediaViwerValue(true)}}
                    />
                    :
                    <div className='no-cover'></div>
                  }
                                       
                  {user._id === loggedInUser._id && 
                    <form onSubmit={handleCoverPicture}>
                      <input id='cover-pic' 
                          className='hide' 
                          type='file' 
                          accept="image/*,image/heif,image/heic"
                          onChange={photoHandler}
                          > 
                      </input>

                      {!newFile.file ? 
                      <>
                        <label htmlFor="cover-pic" title='Change Cover' className={(newFile.url || coverPhoto) ? 'btn cover-btn' : 'btn cover-btn cover-btn-no-cover'}>
                          <Photo style={{marginBottom: '2px'}}/>
                          <span>{loggedInUser.coverPicture ? "Change Cover" : "Add Cover"}</span>
                        </label>
                        {loggedInUser.coverPicture !== "" && 
                          <button type='button' title='Remove Cover' onClick={handleRemoveCover} className='btn cover-btn delete-cover-btn'>
                            <Delete style={{marginBottom: '2px'}}/>
                            <span>Remove Cover</span>
                          </button>
                        }
                      </> 
                      : 
                      <>
                        <button title='Save Changes' className='btn cover-btn save-cover' type='submit'>
                          <Done style={{marginBottom: '2px'}}/>
                          <span>Save Changes</span>
                        </button>
                        <button title='Cancel' className='btn cover-btn cancel-cover' type='button' onClick={cancelSettingCoverImg}>
                          <Close style={{marginBottom: '2px'}}/>
                          <span>Cancel</span>
                        </button>
                        <div className='share-post-cover'>
                            <label htmlFor='share-post' className='first-label'>Share post?</label>
                            <label className='switch-cover' title='Share Post?'>
                                <input type="checkbox" id='share-post' checked={isChecked} onChange={() => setIsChecked(!isChecked)}/>
                                <span className='slider-cover'></span>
                            </label>
                        </div>
                      </>
                      }
                    </form>
                  }
                </div>
                
                <div className='mini-container'>

                  <div className='profile-center'>
                    <img src={profilePicture ? profilePicture : 
                              user.gender === "Male" ? 
                              "/assets/person/male.jpg" :
                              "/assets/person/female.jpg"} 
                            className={profilePicture ? 'profile-picture profile-picture-cursor' : 'profile-picture'}
                            alt='profile picture'
                            onClick={() => {profilePicture && setMediaViwer({fileUrl: profilePicture, fileType: "image"})
                                                                    setOpenMediaViwerValue(true)}}>
                    </img>

                    <div className='name-friends'>
                      <h1>{user.firstName + " " + user.middleName + " " + user.lastName}</h1>
                      <p onClick={() => {setProfilePostsOn(false)
                                        setProfileAboutOn(false)
                                        setProfileFriendsOn(true)
                                        setProfileGallreyOn(false)}}>
                                {user.friends?.length} {user.friends?.length === 1 ? "friend" : "friends"}
                      </p>
                    </div>
                  </div>

                  <div className='edit-profile-section'>
                      {user._id === loggedInUser._id ? 
                        <Link to="/settings" className='btn options-profile-btns' referrerPolicy='no-referrer'>
                          <span>Edit Profile</span>
                          <Edit />
                        </Link> :

                        <>
                          {friendRequestSent ? 
                              <button title="Cancel friend request" 
                                      className='btn options-profile-btns accept-request-btn'
                                      onClick={addfriendHandle}>
                                <span>Friend request sent</span>
                                <Send />
                              </button> :

                              <>
                                {haveFriendRequest ? 
                                  <>
                                    <button title='Accept friend request' 
                                            className='btn options-profile-btns accept-request-btn'
                                            onClick={acceptFriendRequestHandle}>
                                      <Done />
                                      <span>Accept</span>
                                    </button>
                                    <button title='Decline friend request' 
                                            className='btn options-profile-btns decline-request-btn'
                                            onClick={declineFriendRequestHandle}>
                                      <Close />
                                      <span>Decline</span>
                                    </button> 
                                  </> :

                                  <button className={!removeFriend ? 'btn options-profile-btns accept-request-btn friends-btn' :
                                          'btn options-profile-btns decline-request-btn'}
                                          onClick={addfriendHandle}
                                          onMouseOver={RemoveFriendActive}
                                          onMouseLeave={RemoveFriendDeactive}>
                                    {isFriend ? 
                                      <span>
                                        {!removeFriend ? "Friends" : "Remove"}
                                      </span> : 
                                      "Add Friend"}
                                    {isFriend ? 
                                      <>{!removeFriend ? 
                                        <People /> : 
                                        <Delete />}
                                      </> : 
                                      <Add />
                                    }
                                  </button>
                                }
                              </>
                          }
                          <Link to={`https://wesharemessenger.onrender.com/?user=${user._id}`} 
                                referrerPolicy='no-referrer' 
                                className='btn options-profile-btns'
                                target='_blank'>
                            <span>Message</span>
                            <Message />
                          </Link>
                          <button type='submit' className='btn options-profile-btns decline-request-btn' onClick={handleBlocking}>
                            <span>Block</span>
                            <Block />
                          </button>
                        </>
                      }
                  </div>

                  <hr className='hr-profile'></hr>
                          
                  <div className='profile-buttons-more'>
                          
                    <button className={`${profilePostsOn ? "btn prof-btn-active" : "btn profile-btns"}`} 
                            onClick={() =>     {setProfilePostsOn(true)
                                                setProfileAboutOn(false)
                                                setProfileFriendsOn(false)
                                                setProfileGallreyOn(false) }}
                                                >Posts
                    </button>

                    <button className={`${profileAboutOn ? "btn prof-btn-active" : "btn profile-btns"}`}
                            onClick={() => {setProfilePostsOn(false)
                                            setProfileAboutOn(true)
                                            setProfileFriendsOn(false)
                                            setProfileGallreyOn(false) }}
                                            >About
                    </button>

                    <button className={`${profileFriendsOn ? "btn prof-btn-active" : "btn profile-btns"}`}
                            onClick={() => {setProfilePostsOn(false)
                                            setProfileAboutOn(false)
                                            setProfileFriendsOn(true)
                                            setProfileGallreyOn(false) }}
                                            >Friends
                    </button>

                    <button className={`${profileGallreyOn ? "btn prof-btn-active" : "btn profile-btns"}`}
                            onClick={() => {setProfilePostsOn(false)
                                            setProfileAboutOn(false)
                                            setProfileFriendsOn(false)
                                            setProfileGallreyOn(true) }}
                                            >Gallery
                    </button>

                  </div>

                </div>
              </div>
      
            </div>


            {openMediaViwerValue &&
                <MediaViwer mediaViwer={mediaViwer} setOpenMediaViwerValue={setOpenMediaViwerValue} />
            }

            {profilePostsOn && 
                <div className='feed-profile-container'>
                  <Feed userProfileVisiteid={userId} />
                </div>  
            }

            {loggedInUser.friends.includes(user._id) || loggedInUser._id === user._id ? 
            <>
              {profileAboutOn && 
                  <About user={user} openMediaViwerValue={openMediaViwerValue} />
              }

              {profileFriendsOn && 
                  <Friends user={user} loggedInUser={loggedInUser} accessToken={accessToken} axiosJWT={axiosJWT} openMediaViwerValue={openMediaViwerValue} />
              }

              {profileGallreyOn && 
                  <Gallery user={user} 
                          loggedInUser={loggedInUser} 
                          accessToken={accessToken} 
                          axiosJWT={axiosJWT} 
                          openMediaViwerValue={openMediaViwerValue}
                          setOpenMediaViwerValue={setOpenMediaViwerValue}
                          setMediaViwer={setMediaViwer} 
                  />
              }
            </> 
            :
            <>
              {!profilePostsOn && 
              <span className='not-in-friend-list'>
                You are not able to see any information about this 
                person since you're not in their friend list!
              </span> }
            </>
 
            }     
        </div>
      

    }
    </>
  )
}

export default Profile;
