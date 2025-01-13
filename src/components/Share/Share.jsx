import "./share.css";
import React, { useContext, useState, useEffect } from "react";
import {PermMedia, EmojiEmotions} from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom";


const Share = ({setEmojiOpen, setSharePhotoBtnTrigger}) => {

    const { user: loggedInUser, isPop_upSharePostOpen, setIsPop_upSharePostOpen,
          isPop_upCommentOpen, deletePostPopUp} = useContext(AuthContext);

    const [blurBackground, setBlurBackground] = useState(false);
    useEffect(() => {
      if (isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp){
        setBlurBackground(true);
      }
      else{
        setBlurBackground(false);
      }
    }, [isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp])      
    
    return (

        <div className="share shadow">
            <div className={blurBackground ? "share-wrapper blur-background" : "share-wrapper"}>
                <div className="share-top">
                    <Link to={`/profile/${loggedInUser._id}`} referrerPolicy='no-referrer'>
                        <img className="share-profile-pic" 
                            src={
                                loggedInUser.profilePicture ? loggedInUser.profilePicture :
                                    loggedInUser.gender === "Male" ? 
                                    "/assets/person/male.jpg" :
                                    "/assets/person/female.jpg"} 
                                alt="profile picture" />
                    </Link>
                    <label 
                        className="share-input"
                        onClick={() => {setIsPop_upSharePostOpen(true)}}>
                            {"What's in your mind " + loggedInUser.firstName + "?"}
                    </label>
                </div>
                <hr className="share-hr" />
                
                    <div className="share-options">
                        <div className="share-option btn" onClick={() => {setIsPop_upSharePostOpen(true)
                                                                        setSharePhotoBtnTrigger(true) }} >
                            <PermMedia htmlColor="green" className="share-icon"/>
                            <span className="share-option-text">Photo/Video</span>
                        </div>
                        <div className="share-option btn" onClick={() => {setIsPop_upSharePostOpen(true)
                                                                        setEmojiOpen(true)}} >
                            <EmojiEmotions htmlColor="goldenrod" className="share-icon"/>
                            <span className="share-option-text">Feelings</span>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Share;