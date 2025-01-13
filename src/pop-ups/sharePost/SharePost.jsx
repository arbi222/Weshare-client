import React, { useState, useEffect, useRef } from 'react'
import "./sharepost.css"
import { Close , PermMedia, EmojiEmotions} from "@mui/icons-material"
import EmojiPicker from "emoji-picker-react"
import upload from '../../lib/upload'
import { toast } from 'react-toastify'

const SharePost = ({setIsPop_upSharePostOpen, loggedInUser, 
                    isPop_upSharePostOpen, axiosJWT, accessToken, 
                    emojiOpen, setEmojiOpen, sharePhotoBtnTrigger, 
                    setSharePhotoBtnTrigger, openAlert, setOpenAlert}) => {

    const postId = typeof(isPop_upSharePostOpen) !== "boolean" ? isPop_upSharePostOpen : null
    // isPop_upSharePostOpen acts like a boolean state that opens up the pop up if we try to share a post 
    // also it can contain the postId if we try to edit any post, in this case its not a boolean

    const apiUrl = process.env.REACT_APP_API_URL;
    const [postdesc, setPostDesc] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);

    const [postPrivacy, setPostPrivacy] = useState("Public");

    const [havePhoto, setHavePhoto] = useState({
        url: "",
        fileType: ""
    });
    const [newPhoto, setNewPhoto] = useState({
        file: null,
        url: ""
    })

    const handleCancelPhoto = () => {
        setNewPhoto({file: null, url: ""})  
        setHavePhoto({url: "", fileType: ""})
        document.getElementById("share-photo-video").value = null;
    }

    const [postBtnState, setPostBtnState] = useState(false);

    const emojiDiv = useRef();

    
    useEffect(() => {
        if (sharePhotoBtnTrigger){
            const sharePhotoBtn = document.getElementById("share-photo-video");
            sharePhotoBtn.click();
            setSharePhotoBtnTrigger(false)
        }
    })

    useEffect(() => {
        if (emojiOpen){
          const handleEmojiButton = (e) => {
            if (!emojiDiv.current.contains(e.target)){
                setEmojiOpen(false);
            }
          }
      
          document.addEventListener("mousedown", handleEmojiButton);
    
          return () => {
            document.removeEventListener("mousedown", handleEmojiButton);
          }
        }
    })

    const handleEmoji = (e) => {
        const newMessage = postdesc.slice(0, cursorPosition) + e.emoji + postdesc.slice(cursorPosition);
        setPostDesc(newMessage);
        setCursorPosition((prevPosition) => prevPosition + e.emoji.length);
    }


    useEffect(() => {
        if (postId){
            const getPost = async () => {
                try{
                    const res = await axiosJWT.get(apiUrl + "/posts/post/" + postId + "/" + loggedInUser._id , {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    });
                    setPostDesc(res.data.description);
                    setPostPrivacy(res.data.privacy);
                    setHavePhoto({url: res.data.image, fileType: res.data.fileType})
                }   
                catch(err){
                    toast.error("Error! Could not get the post!")
                }
            }
            getPost()
        }
    },[postId])


    useEffect(() => {

        function isEmptyOrSpaces(str){
            return str === null || str.match(/^ *$/) !== null;
        }

        if (newPhoto.file){
            setPostBtnState(true);
        }
        else if (!isEmptyOrSpaces(postdesc)){
            setPostBtnState(true);
        }
        else{
            setPostBtnState(false);
        }
    },[newPhoto.file, postdesc])

    const handleFiles = (e) => {
        if (e.target.files[0]){
            const maxSize = 30 * 1024 * 1024;
            const file = e.target.files[0];
            const fileType = file.type;

            if (file.size > maxSize){
                setOpenAlert("fileSize");
                const shareFile = document.getElementById("share-photo-video");
                if (shareFile){
                    shareFile.value = null;
                }
                return;
            }
            else if (fileType.startsWith("image/") || fileType.startsWith("video/")){
                setNewPhoto({
                    file: e.target.files[0],
                    url: URL.createObjectURL(e.target.files[0])
                })
                setHavePhoto({url: "", fileType: ""})
            }
            else{
                setOpenAlert("fileType");
                const shareFile = document.getElementById("share-photo-video");
                if (shareFile){
                    shareFile.value = null;
                }
                return;
            }    
        }
    }

    const [progress, setProgress] = useState(0);

    const sharePostHandler = async (e) => {
        e.preventDefault();

        let thePost = {
            userId: loggedInUser._id,
            description: postdesc,
            privacy: postPrivacy,
        }

        let fileUrl = null;

        try{
            if (havePhoto.url){
                thePost.image = havePhoto.url;
                thePost.fileType = havePhoto.fileType;
            }
            else{
                if (newPhoto.file){
                    fileUrl = await upload(newPhoto.file, (progress) => {
                        setProgress(progress);
                    })
    
                    thePost.image = fileUrl;
                    if (newPhoto.file.type.startsWith("image/")){
                        thePost.fileType = "image";
                    }
                    else{
                        thePost.fileType = "video";
                    }

                    await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id + "/addToGallery", {userId: loggedInUser._id, file: fileUrl, fileType: thePost.fileType} , {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    })
                }
                else{
                    thePost.image = "";
                }
            }

            if (postId){
                thePost.edited = true;
                await axiosJWT.put(apiUrl + "/posts/" + postId , thePost , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                });
            }
            else{
                await axiosJWT.post(apiUrl + "/posts", thePost , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                });
            }
            window.location.reload();
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }   
    }


  return (
    <div className={openAlert ? 'pop-up share-post-pop-up shadow blur-background' : 'pop-up share-post-pop-up shadow'}>
      
        <div className='main-share-header'>
          <h2>{postId ? "Edit post" : "Create post"}</h2>
          <span className='btn close-btn' title='Close'
                  onClick={() => {setIsPop_upSharePostOpen(false)}}>
                  <Close style={{marginTop: "3px"}}/>
          </span>
        </div>

        <hr className='hr-share-postPopup'></hr>

        <form onSubmit={sharePostHandler}>
            <div className='share-post-with'>
                <p>Post's Privacy: </p>
                <div>
                    <input className='radio-cursor' 
                            type="radio" 
                            id='everyone' 
                            name="sharing-to" 
                            value="public"
                            checked={postPrivacy === "Public"}
                            readOnly
                            onClick={() => {setPostPrivacy("Public")}}>
                    </input>  
                    <label className='radio-gaps radio-cursor' htmlFor='everyone'>Public</label>

                    <input className='radio-cursor' 
                            type="radio" 
                            id='friends' 
                            name="sharing-to" 
                            value="friends"
                            checked={postPrivacy === "Friends"}
                            readOnly
                            onClick={() => {setPostPrivacy("Friends")}}>
                    </input>
                    <label className='radio-gaps radio-cursor' htmlFor='friends'>Friends</label>

                    <input className='radio-cursor' 
                            type="radio" 
                            id='noone' 
                            name="sharing-to" 
                            value="onlyme"
                            checked={postPrivacy === "Onlyme"}
                            readOnly
                            onClick={() => {setPostPrivacy("Onlyme")}}>
                    </input> 
                    <label className='radio-cursor' htmlFor='noone'>Only Me</label>
                </div>
            </div> 

            <div>
                <textarea placeholder={`What's in your mind, ${loggedInUser.firstName}?`}
                        className='post-text-area' 
                        autoFocus 
                        value={postdesc}
                        onChange={(e) => {setPostDesc(e.target.value)}}
                        onSelect={(e) => setCursorPosition(e.target.selectionStart)}>
                </textarea>
                {newPhoto.url && 
                    <div className='img-div'>
                        {newPhoto.file.type.startsWith("image/") ?
                            <img className='share-post-img' src={newPhoto.url} alt="image to be shared" ></img>
                        :
                            newPhoto.file.type.startsWith("video/") ?
                                <video src={newPhoto.url} width={500} height={250} controls alt="share video" /> 
                                :
                                <p style={{textAlign: "center"}}>Choose another file to upload.</p>
                        }
                        <label title='Remove Photo/Video' className='btn remove-photo-btn' onClick={handleCancelPhoto}>
                            <Close style={{marginTop: "3px"}}/>
                        </label>
                    </div>
                }

                {havePhoto.url && 
                    <div className='img-div'>
                        {havePhoto.fileType === "image" ?
                            <img className='share-post-img' src={havePhoto.url} alt="image to be shared"></img>
                        :
                            havePhoto.fileType === "video" &&
                                <video style={{marginLeft: "5px"}} src={havePhoto.url} width={485} height={250} controls alt="share video" /> 
                        }
                        <label title='Remove Photo/Video' 
                                className='btn remove-photo-btn'
                                onClick={handleCancelPhoto}>                                                           
                            <Close style={{marginTop: "3px"}}/>
                        </label>
                    </div>
                }   

                {progress > 0 && progress < 100 && (
                    <div className="progress-bar-container">
                        <progress value={progress} max="100">{progress}</progress>
                    </div>
                )} 
            </div> 

            <div className='share-post-popup-btns'>
                <div ref={emojiDiv} style={{position: "relative"}}>
                    <input accept='image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv' 
                            id='share-photo-video' 
                            className='hide' 
                            type='file' 
                            onChange={handleFiles}
                    >
                    </input>
                    <div className='add-other-things'>
                        <label htmlFor="share-photo-video" title='Photo/Video' className='btn'>
                            <PermMedia style={{marginTop: "3px"}} htmlColor="green"/>
                        </label>
                        {/* <label className='btn' title='Tag People'>
                            <Label style={{marginTop: "3px"}} htmlColor="blue"/>
                        </label> */}
                        {/* <label className='btn' title='Check In'>
                            <Room style={{marginTop: "3px"}} htmlColor="tomato"/>
                        </label> */}
                        <label className='btn' title='Emoji' onClick={() => setEmojiOpen(!emojiOpen)}>
                            <EmojiEmotions style={{marginTop: "3px"}} htmlColor="goldenrod"/>
                        </label>
                    </div>
                    <div className='emoji-place'>
                        <EmojiPicker open={emojiOpen} emojiStyle='facebook' skinTonesDisabled searchDisabled width={300} height={300} onEmojiClick={handleEmoji}/>
                    </div>
                </div>
            </div>

            <hr className='hr-share-postPopup'></hr>
            
            <button className={postBtnState ? "btn share-post-btn" : "not-allowed share-post-btn"} 
                    type="submit"
                    disabled={!postBtnState}>
                    {postId ? "Save" : "Post"}
            </button>
        </form>

    </div>
  )
}

export default SharePost;