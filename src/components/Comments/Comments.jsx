import React, { useState , useEffect, useRef} from 'react'
import "./comment.css"
import { MoreHoriz, Edit, Delete } from "@mui/icons-material";
import { format } from "timeago.js"
import { toast } from 'react-toastify'


const Comments = ({comment,loggedInUser,axiosJWT,accessToken,post,setHaveDeletedComment,setEditCommentId,editCommentId}) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [commentOwner, setCommentOwner] = useState(null);
    const [more , setMore] = useState(false);

    const [horizontalBtn, setHorizontalBtn] = useState(false);

    const horizontalBtnMenu = useRef()

    useEffect(() => {
        if (horizontalBtn){
          const handleMoreButtons = (e) => {
            if (!horizontalBtnMenu.current.contains(e.target)){
                setHorizontalBtn(false);
            }
          }
      
          document.addEventListener("mousedown", handleMoreButtons);
    
          return () => {
            document.removeEventListener("mousedown", handleMoreButtons);
          }
        }
    })

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const res = await axiosJWT.get(`${apiUrl}/users/getUser/${comment.userId}/` + loggedInUser._id, {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                 });
                setCommentOwner(res.data)
               
            }
            catch(err){
                toast.error("Error! Could not get the comment's owner name!")
            }
        }
        fetchUser();
    }, [comment.userId])


    const handleDeleteComment = async () => {
        try{
            await axiosJWT.delete(apiUrl + "/comments/" + comment._id, {data: {userId: loggedInUser._id, postOwnerId: post.userId}, headers: {authorization: `Bearer ${accessToken}`}});
            setHaveDeletedComment(true)
        }
        catch(err){
            toast.error("Error! Could not delete the comment!")
        }
    }


    return <>
        {commentOwner &&
        <div className='comments-section'>
            <a href={(commentOwner !== "blockedByYou" && commentOwner !== "blockedByThem") && '/profile/' + commentOwner?._id}>
                <img className='comment-profile-pic' 
                    src={(commentOwner !== "blockedByYou" && commentOwner !== "blockedByThem") ? 
                            commentOwner?.profilePicture ? commentOwner?.profilePicture :
                                commentOwner?.gender === "Male" ? 
                                "/assets/person/male.jpg" :
                                "/assets/person/female.jpg" 
                            :
                             "/assets/person/blockedUser.png"
                        }
                    alt='profile pic'
                />
            </a>
            <div className='flex-align' ref={horizontalBtnMenu}>
                <div className={editCommentId === comment._id ? 'comment-desc being-edited' : 'comment-desc'}>
                    <a className='comment-user-name' 
                        href={(commentOwner !== "blockedByYou" && commentOwner !== "blockedByThem") && '/profile/' + commentOwner?._id}>
                        <h5>
                            {(commentOwner !== "blockedByYou" && commentOwner !== "blockedByThem") ? 
                                commentOwner?.firstName + " " + commentOwner?.middleName + " " + commentOwner?.lastName
                                :
                                "User"
                            }
                        </h5>
                    </a>

                    {(() => {
                        if (comment.description){
                            if (comment.description.length < 200) {
                                return (
                                  <p className='comment-text'>{comment.description}</p>
                                )
                            }
                            else {
                              if (more){
                                return (
                                    <p className='comment-text'>{comment.description}</p>
                                )
                              }
                              else{
                                return (
                                    <p className='comment-text'>{comment.description.substring(0, 201) + " ..."}</p>
                                )
                              }
                            }
                        }
                    })()}

                    {comment.description.length > 200 && 
                        <button className='show-more-less-btn' onClick={() => {setMore(!more)}}>
                            {more ? "See less" : "See more"}
                        </button> 
                    }
                    
                    <div className='comment-time'>
                        {format(comment.createdAt)}
                        {comment.edited && <span className="edited-comment"> (Edited)</span>}
                    </div>
                </div>
                
                {(loggedInUser._id === post.userId || loggedInUser._id === comment.userId) && 
                    <div>
                        <button className='btn delete-comment-btn' onClick={() => setHorizontalBtn(!horizontalBtn)}>
                            <MoreHoriz className='more-icon'/>
                        </button>
                    </div>
                }   

                {horizontalBtn && 
                    <div className="horizontal-more-btn shadow">
                        {loggedInUser._id === comment.userId && 
                        <>
                            <button className="btn horizontal-btn-child" 
                                    title='Edit comment'>
                                <Edit onClick={() => {setEditCommentId(comment._id)
                                                    setHorizontalBtn(false)}}/>
                            </button>
                            <hr className='comment-more-hr'/>
                        </>
                        }
                        <button className="btn horizontal-btn-child" 
                                title='Delete comment'
                                onClick={handleDeleteComment}>
                            <Delete />
                        </button>
                    </div>
                }
            </div>
        </div>   
        }   

    </>

}

export default Comments;