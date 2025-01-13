import React, { useState , useEffect, useContext , useRef } from "react";
import "./post.css"
import {Public, People, Lock, MoreVert, ThumbUpAlt , Comment, Delete, Edit, PlayCircleOutline} from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import { format } from "timeago.js"
import { toast } from "react-toastify";
import checkIfFileExists from "../../lib/checkFileExistence";

const Post = ({post, specificPost, comments, pageform}) =>{

    const { user: loggedInUser, accessToken, axiosJWT, socket, setIsPop_upSharePostOpen,
                setIsPop_upCommentOpen, setLikesPopUpOpen,
                setDeletePostPopUp, setMediaViwer, setOpenMediaViwerValue} = useContext(AuthContext);

    const apiUrl = process.env.REACT_APP_API_URL;
                
    const [user, setUser] = useState({})
    const [postComments, setPostComments] = useState([]);
    const [like, setLike] = useState(post.likes.length)
    const [isliked, setIsliked] = useState(false)
    const [loader, setLoader] = useState(false)
    const [more , setMore] = useState(false);

    const [verticalBtn, setVerticalBtn] = useState(false);
    const verticalBtnMenu = useRef()

    useEffect(() => {
        if (verticalBtn){
          const handleMoreButtons = (e) => {
            if (!verticalBtnMenu.current.contains(e.target)){
                setVerticalBtn(false);
            }
          }
      
          document.addEventListener("mousedown", handleMoreButtons);
    
          return () => {
            document.removeEventListener("mousedown", handleMoreButtons);
          }
        }
    })

    useEffect(() => {
        setIsliked(post.likes.includes(loggedInUser._id));
    },[loggedInUser._id, post.likes])

    useEffect(() => {
        setLoader(true)
        const fetchUser = async () => {
            try{
                const res = await axiosJWT.get(`${apiUrl}/users/getUser/${post.userId}/` + loggedInUser._id , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                });
                setUser(res.data)
                setLoader(false);
            }
            catch(err){
                toast.error("Error! Something went wrong!");
                setLoader(false);
            }
        }
        fetchUser();
    }, [post.userId])

    useEffect(() => {
        if (comments){
            setPostComments(comments);
        }
        else{
            const getComments = async () => {
                try{
                    const res = await axiosJWT.get(`${apiUrl}/comments/${post._id}` , {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    });
                    setPostComments(res.data);
                }
                catch(err){
                    toast.error("Error! Could not get the comments!")
                }
            }
    
            getComments()
        }
    },[comments, post._id])

    
    const likehandler = async () => {
 
        const notification = {
            authorId: loggedInUser._id, 
            postId: post._id,
            receiverId: post.userId,
            forLikePurpose: true,
            content: loggedInUser.firstName + " " + loggedInUser.middleName + " " + loggedInUser.lastName + " likes your post."
        }

        try{
            await axiosJWT.put(apiUrl + "/posts/" + post._id + "/like", {userId: loggedInUser._id} , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            if (!isliked && (notification.authorId !== notification.receiverId)){
                await axiosJWT.post(apiUrl + "/notifications/", notification , {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                });
                socket.current.emit("sendNotification", notification);
            }
            else{
                await axiosJWT.delete(apiUrl + "/notifications/" + notification.postId + "/unlike/" + loggedInUser._id, 
                    {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }}
                );
                socket.current.emit("removeNotification", notification);
            }
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }
        setLike(isliked ? like - 1 : like + 1)
        setIsliked(!isliked)
    }

    const [fileExists, setFileExists] = useState(true);
    const [coverFileExists, setCoverFileExists] = useState(true);
    useEffect(() => {
        const verifyFile = async () => {
            if (post.image) {
                const exists = await checkIfFileExists(post.image);
                setFileExists(exists);
            }
            if (user.coverPicture) {
                const coverExists = await checkIfFileExists(user.coverPicture);
                setCoverFileExists(coverExists);
            }
        };

        verifyFile();
    }, [post?.image, user.coverPicture])

    return (
        <>
            {user._id &&
            <div className={specificPost === post._id ? "specific-post" : "post shadow"}>

                {!loader &&  
                    <div className="post-wrapper">
                        <div className="post-top" ref={verticalBtnMenu}>
                            <div className="post-top-left">
                                <a href={`/profile/${user._id}`} referrerPolicy='no-referrer'>
                                    <img className="post-profile-picture" 
                                        src={user.profilePicture ? user.profilePicture : 
                                                user.gender === "Male" ? 
                                                "/assets/person/male.jpg" :
                                                "/assets/person/female.jpg"
                                            } 
                                        alt="profile pic" 
                                        />
                                </a>
                                <div className="post-top-left-details">
                                    <header>
                                        {post.updateProfile || post.updateCover ? 
                                            <>
                                                <a className="post-username-link" referrerPolicy='no-referrer' href={`/profile/${user._id}`}>
                                                    <p className="post-username">{user.firstName + " " + user.middleName + " " + user.lastName}</p>
                                                </a>
                                                {post.updateProfile ? 
                                                    <span className="post-update-profile">updated their profile picture.</span>
                                                    :
                                                    <span className="post-update-profile">updated their cover picture.</span>
                                                }
                                            </>
                                            :
                                            <a className="post-username-link" referrerPolicy='no-referrer' href={`/profile/${user._id}`}>
                                                <p className="post-username">{user.firstName + " " + user.middleName + " " + user.lastName}</p>
                                            </a>
                                        }
                                    </header>
                                    
                                    <div>
                                        {(() => {
                                            if (post.privacy === "Public"){
                                                return (
                                                    <span title='Public'><Public style={{fontSize:"16px", color: "grey", marginTop: "3px"}}/></span>
                                                )
                                            }
                                            else if (post.privacy === "Friends"){
                                                return (
                                                    <span title='Friends'><People style={{fontSize:"16px", color: "grey", marginTop: "3px"}}/></span>
                                                )
                                            }
                                            else if (post.privacy === "Onlyme"){
                                                return (
                                                    <span title='Only Me'><Lock style={{fontSize:"16px", color: "grey", marginTop: "3px"}}/></span>
                                                )
                                            }
                                        })()}

                                        <span className="post-date">{format(post.createdAt)}</span>
                                        {post.edited && <span className="edited-post">(Edited)</span>}
                                    </div>
                                </div>
                                    
                            </div>

                            
                            {loggedInUser._id === post.userId && 
                                <div className="post-top-right" title={!verticalBtn ? post.updateProfile ? undefined : "Edit / Delete" : undefined}>
                                    <button className="btn delete-post-btn" onClick={() => setVerticalBtn(!verticalBtn)}>
                                        <MoreVert style={{marginTop:"3px"}}/>
                                    </button>
                                </div>
                            }
                            {verticalBtn && 
                                <div className="vertical-more-btn shadow">
                                    {!post.updateProfile && !post.updateCover &&
                                        <>
                                            <button className="btn vertical-btn-child" onClick={() => {setIsPop_upSharePostOpen(post._id)
                                                                                                        setVerticalBtn(false)}}>
                                                <span>
                                                    <Edit />
                                                </span>
                                                <span>
                                                    Edit post
                                                </span>
                                            </button>
                                            <hr className="post-hr" />
                                        </>
                                    }
                                    
                                    <button className="btn vertical-btn-child" onClick={() => {setDeletePostPopUp(post._id)
                                                                                                setVerticalBtn(false)}}>
                                        <span>
                                            <Delete />
                                        </span>
                                        <span>
                                            Delete post
                                        </span>
                                    </button>
                                </div>
                            }
                             
                            
                        </div>
                        <div className="post-center">

                            {(() => {
                                if (post.description){
                                    if (post.description.length < 480) {
                                        return (
                                          <span className="post-text" style={{display: "block", marginBottom: "20px"}}>{post.description}</span>
                                        )
                                    }
                                    else {
                                      if (more){
                                        return (
                                            <span className="post-text">{post.description}</span>
                                        )
                                      }
                                      else{
                                        return (
                                            <span className="post-text">{post.description.substring(0, 481) + " ..."}</span>
                                        )
                                      }
                                    }
                                }

                            })()}

                            {post.description.length > 480 && 
                            <button className='show-more-less-btn' onClick={() => {setMore(!more)}}>
                                {more ? "See less" : "See more"}
                            </button> 
                            }

                            {post.updateProfile ? (
                                <section className={user.coverPicture ? fileExists ? "updateProfile-section" : "updateProfile-section2" : undefined}>
                                    {coverFileExists && user.coverPicture && (
                                        <img
                                            className="update-profile-cover-pic"
                                            src={user.coverPicture}
                                            alt="cover pic"
                                            onClick={() => {
                                                setMediaViwer({ fileUrl: user.coverPicture, fileType: "image" });
                                                setOpenMediaViwerValue(true);
                                            }}
                                        />
                                    )}
                                    {fileExists ? 
                                        <img
                                        className={user.coverPicture && coverFileExists ? "update-profile-profile-pic" : "update-profile-profile-pic2"}
                                        src={post.image}
                                        alt="profile pic"
                                        onClick={() => {
                                            setMediaViwer({ fileUrl: post.image, fileType: "image" });
                                            setOpenMediaViwerValue(true);
                                        }}
                                    />
                                    :
                                        <div className="missing-file-placeholder">Profile Image not available</div>
                                    }
                                </section>
                            ) : (
                                post.image &&
                                (post.fileType === "image" ? (
                                    fileExists ? (
                                        <img
                                            className="post-img"
                                            src={post.image}
                                            alt="post picture"
                                            onClick={() => {
                                                setMediaViwer({ fileUrl: post.image, fileType: "image" });
                                                setOpenMediaViwerValue(true);
                                            }}
                                        />
                                    ) : (
                                        <div className="missing-file-placeholder">Image not available</div>
                                    )
                                ) : (
                                    <div
                                        className={fileExists ? "video-styling" : undefined}
                                        onClick={() => {
                                            if (fileExists) {
                                                setMediaViwer({ fileUrl: post.image, fileType: "video" });
                                                setOpenMediaViwerValue(true);
                                            }
                                        }}
                                    >
                                        {fileExists ? ( <>
                                            <span>
                                                <PlayCircleOutline style={{ marginTop: "3px", fontSize: "100px" }} />
                                            </span>
                                            <video
                                                src={post.image}
                                                className="post-video"
                                                height={300}
                                                alt="share video"
                                            ></video>
                                        </>
                                        ) : (
                                            <div className="missing-file-placeholder">Video not available</div>
                                        )}
                                    </div>
                                ))
                            )}

                        </div>
                        <div className="post-bottom">

                            <div className="post-bottom-above-hr">
                                <span className="post-like-counter" onClick={() => setLikesPopUpOpen(post._id)}> 
                                    {like === 1 ? like + " Like" : like + " Likes"} 
                                </span>
                                <span className="post-comment-text" onClick={() => {!pageform && setIsPop_upCommentOpen(post._id)}}>
                                    {postComments?.length === 1 ? postComments?.length + " Comment" : postComments?.length + " Comments"}
                                </span>
                            </div>

                            <hr className="post-hr"></hr>

                            <div className="post-bottom-hr">
                                <button className="btn" onClick={likehandler}>
                                    <ThumbUpAlt 
                                        style={{color: isliked ? "var(--main-color)" : "#000"}}
                                        className="like-comment-icon" 
                                    />
                                    <span style={{color: isliked ? "var(--main-color)" : "#000"}}>Like</span>
                                </button>
                                <button className="btn" onClick={() => {!pageform && setIsPop_upCommentOpen(post._id)}}>
                                    <Comment className="like-comment-icon" 
                                    />
                                    <span>Comment</span>
                                </button>
                            </div>

                        </div>
                    </div>
                }

            
            </div>
            }

        </>

    )

}

export default Post;