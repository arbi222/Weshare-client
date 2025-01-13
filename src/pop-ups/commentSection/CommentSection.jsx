import React, { useState , useContext, useEffect} from 'react'
import "./commentSection.css"
import Post from '../../components/Post/Post'
import { Close , Send} from "@mui/icons-material"
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext'
import Comments from '../../components/Comments/Comments';
import { toast } from 'react-toastify';


const CommentSection = ({pagePostId, openMediaViwerValue}) => {

    const { user: loggedInUser, accessToken, axiosJWT, socket, isPop_upCommentOpen, setIsPop_upCommentOpen,
            deletePostPopUp, isPop_upSharePostOpen, isLikesPopUpOpen} = useContext(AuthContext);

    const apiUrl = process.env.REACT_APP_API_URL;
    const [post, setPost] = useState([]);
    const [postOwnerUser, setPostOwnerUser] = useState(null);
    const [loader, setLoader] = useState(false)

    const [isloading, setIsLoading] = useState(true)
    const [comments, setComments] = useState([]);
    const [haveDeletedComment, setHaveDeletedComment] = useState(false);
    const [editCommentId, setEditCommentId] = useState(null)
    const [haveEditedComment, sethaveEditedComment] = useState(false);

    const [textareaValue, setTextareaValue] = useState("");
    const [CommentBtnState, setCommentBtnState] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            setLoader(true)
            try{
                const res = pagePostId ? 
                await axiosJWT.get(apiUrl + "/posts/post/" + pagePostId + "/" + loggedInUser._id , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                })  
                : await axiosJWT.get(apiUrl + "/posts/post/" + isPop_upCommentOpen + "/" + loggedInUser._id , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                });
                
                if (res.data !== null){
                    setPost([res.data]);

                    const userResponse = await axiosJWT.get(`${apiUrl}/users/getUser/${res.data.userId}/` + loggedInUser._id, {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                    });
                    setPostOwnerUser(userResponse.data);
                }
       
                setTimeout(() => {
                    setLoader(false);
                },500)
            }
            catch(err){
                toast.error("Error! Something went wrong!")
                setPost(err.request.status)
                setLoader(false)
            }
        }

        fetchPost();
    },[pagePostId ,isPop_upCommentOpen])


    useEffect(() => {

        function isEmptyOrSpaces(str){
            return str === null || str.match(/^ *$/) !== null;
        }

        if (!isEmptyOrSpaces(textareaValue)){
            setCommentBtnState(true);
        }
        else{
            setCommentBtnState(false);
        }
    },[textareaValue])


    useEffect(() => {
        const fetchComments = async () => {
            try{
                if (post[0]?._id){
                    const res = await axiosJWT.get(apiUrl + "/comments/" + post[0]._id, {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    });
                    setHaveDeletedComment(false);
                    sethaveEditedComment(false);
                    setComments(res.data.sort((c1,c2) => {
                        return new Date(c2.createdAt) - new Date(c1.createdAt);
                    }))
                    setIsLoading(false)
                }
            }
            catch(err){
                toast.error("Error! Could not get the comments!");
                setIsLoading(false)
            }
        }
        fetchComments()
    },[post, haveDeletedComment, haveEditedComment])

    useEffect(() => {
        const fetchCommentforEdit = async () => {
            try{
                if(editCommentId){
                    const res = await axiosJWT.get(apiUrl + "/comments/onecomment/" + editCommentId , {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    });
                    setTextareaValue(res.data.description);
                }
            }   
            catch(err){
                toast.error("Error! Something went wrong!")
            }
        }
        fetchCommentforEdit()
    },[editCommentId])
    

    const shareCommentHandler = async (e) => {
        e.preventDefault();

        const theComment = {
            userId: loggedInUser._id,
            postId: post[0]._id,
            description: textareaValue,
        }
        
        const notification = {
            authorId: loggedInUser._id, 
            postId: post[0]._id,
            receiverId: post[0].userId,
            content: loggedInUser.firstName + " " + loggedInUser.middleName + " " + loggedInUser.lastName + " commented on your post."
        }

        try{
            if (editCommentId){
                theComment.edited = true;
                await axiosJWT.put(apiUrl + "/comments/" + editCommentId , theComment , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                });
                setTextareaValue("");
                sethaveEditedComment(true);
                setEditCommentId(null);
            }
            else{
                const res = await axiosJWT.post(apiUrl + "/comments", theComment , {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                });
                setTextareaValue("");
                setComments([res.data , ...comments])
                if (notification.authorId !== notification.receiverId){
                    await axiosJWT.post(apiUrl + "/notifications/", notification , {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    });
                    socket.current.emit("sendNotification", notification);
                }
            }   
        }
        catch(err){
            toast.error("Error! Something went wrong!")
        }

    }

    useEffect(() => {

        const keyDownHandler = (event) => {
            if (event.key === "Enter"){
                shareCommentHandler(event)
            }
        }

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler)
        }
    })

    if (!postOwnerUser){
        if (post === 500){
            return (
                <div className='comment-container pop-up shadow'>
                    <div className='no-post-available'>The post does not exist or may have been deleted!</div>
                </div>
            )
        }
        else{
            return (
                <div className='comment-container pop-up shadow'>
                    <div className='comment-loader-container'>
                            <CircularProgress size="40px" className="feed-loader" />
                    </div>
                </div>
            )
        }
    }

    return <>
        <div className={!pagePostId ? 
                            deletePostPopUp || isPop_upSharePostOpen || isLikesPopUpOpen || openMediaViwerValue ? 
                            'blur-background comment-container pop-up shadow' : 
                            'comment-container pop-up shadow' : 
                            isLikesPopUpOpen || deletePostPopUp || isPop_upSharePostOpen || openMediaViwerValue ? 
                            'page-post-form shadow blur-background' :
                            'page-post-form shadow'}>

            {!pagePostId && <>
                <div className='main-comment-header'>
                    <h2>{postOwnerUser?.firstName + "'s post"}</h2>
                    <span className='btn close-btn' title='Close'
                            onClick={() => {setIsPop_upCommentOpen(false)}}>
                            <Close style={{marginTop: "3px"}}/>
                    </span>
                </div>

                <hr className='comment-hr'/>
            </> }
            

            {loader ? 
                    <div className='comment-loader-container' style={{padding: pagePostId ? "50px" : "0"}}>
                        <CircularProgress size="40px" className="feed-loader" />
                    </div>

                :

                <>
                    {(post !== 500) && (post.length !== 0) ? 
                        
                        post !== 401 ?

                            <>
                                <div className={!pagePostId ? 'second-comment-section' : undefined} 
                                    style={{paddingLeft: pagePostId ? "5px" : "0"}}>
                                    {
                                        post.map((p) => (
                                            <Post key={p._id} 
                                                    post={p} 
                                                    specificPost={p._id} 
                                                    comments={comments}
                                                    pageform={pagePostId ? true : false}
                                            />
                                        ))
                                    }

                                    <hr className='comment-hr comment-hr-width'/>
                                
                                    <div className={pagePostId ? "second-comment-section" : undefined} style={{maxHeight: pagePostId ? "300px" : undefined}}>
                                        {
                                            isloading ?
                                                <div className='comment-loader-container' style={{padding: pagePostId ? "50px" : "0"}}>
                                                    <CircularProgress size="40px" className="feed-loader" />
                                                </div>
                                            :    
                                            comments.map((comment) => (
                                                <Comments key={comment._id} 
                                                        comment={comment}
                                                        loggedInUser={loggedInUser}
                                                        post={post[0]} 
                                                        setHaveDeletedComment={setHaveDeletedComment}
                                                        setEditCommentId={setEditCommentId}
                                                        editCommentId={editCommentId}
                                                        accessToken={accessToken}
                                                        axiosJWT={axiosJWT}
                                                />
                                            ))
                                        } 
                                    </div>             
                                </div>
                                    
                                    
                                <div className='our-comment-section shadow'>
                                    
                                    <a href={"/profile/" + loggedInUser._id}>
                                        <img src={loggedInUser.profilePicture ? loggedInUser.profilePicture :
                                                     loggedInUser.gender === "Male" ? 
                                                     "/assets/person/male.jpg" :
                                                     "/assets/person/female.jpg"} 
                                            alt="profile picture"
                                            className='comment-profile-pic'
                                            referrerPolicy='no-referrer' 
                                        />
                                    </a>
                                        
                                    <label htmlFor='textarea' className='input-and-btn'>
                                        <form onSubmit={shareCommentHandler}>
                                            <textarea id='textarea' 
                                                    autoFocus
                                                    value={textareaValue} 
                                                    className='comment-textarea' 
                                                    placeholder='Write a comment...'
                                                    onChange={(e) => setTextareaValue(e.target.value)}>
                                            </textarea>
                                            {editCommentId &&  
                                                <button title='Cancel editing' 
                                                        type='button' 
                                                        className='btn cancel-editing-comment-btn' 
                                                        onClick={() => {setEditCommentId(null)
                                                                        setTextareaValue("")}}>
                                                     <Close className='send-icon'/>
                                                </button>
                                            }
                                            <button title='Comment' 
                                                    type='submit' 
                                                    className={CommentBtnState ? 'btn send-comment-btn' : "cursor send-comment-btn"} 
                                                    disabled={!CommentBtnState}>
                                                 <Send className='send-icon'/>
                                            </button>
                                        </form> 
                                    </label>
                                        
                                </div>
                                        
                            </>

                        :

                        <div className='no-post-available'>You are not authorized to see this post!</div>

                    :

                    <div className='no-post-available'>The post does not exist or may have been deleted!</div>
                                                        
                    }   
                </>
                
            }

        </div>
    
    </>

}

export default CommentSection;