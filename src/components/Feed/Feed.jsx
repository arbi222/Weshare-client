import React, { useContext, useEffect, useState } from 'react'
import "./feed.css"
import { CircularProgress } from '@mui/material';
import Share from "../Share/Share"
import Post from "../Post/Post"
import CommentSection from '../../pop-ups/commentSection/CommentSection';
import LikesSection from '../../pop-ups/likesSection/likesPopUp';
import DeletePostPopUp from '../../pop-ups/deletePost/DeletePostPopUp';
import SharePost from '../../pop-ups/sharePost/SharePost';
import { AuthContext } from '../../context/AuthContext'
import AlertPopUp from '../../pop-ups/alertPopUp/AlertPopUp';
import { toast } from 'react-toastify'


const Feed = ({userProfileVisiteid}) => {

  const { user: loggedInUser, axiosJWT, accessToken, isPop_upCommentOpen, deletePostPopUp, setDeletePostPopUp,
                isPop_upSharePostOpen, setIsPop_upSharePostOpen, isLikesPopUpOpen, openAlert, setOpenAlert, openMediaViwerValue
                } = useContext(AuthContext)
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);

  const [emojiOpen, setEmojiOpen] = useState(false)
  const [sharePhotoBtnTrigger, setSharePhotoBtnTrigger] = useState(false)

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    
    const fetchPosts = async () => {
      try{
        setLoader(true);
        const res = userProfileVisiteid ? 
        await axiosJWT.get(apiUrl + "/posts/profile/" + userProfileVisiteid, {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
        })
        : await axiosJWT.get(apiUrl + "/posts/timeline/" + loggedInUser._id , {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
        })
        setPosts(res.data.sort((p1,p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }))
        setTimeout(() => {
          setLoader(false);
        },1000)
      }
      catch(err){
        toast.error("Error! Could not get the posts!")
      }
      finally{
        setLoader(false);
      }
    }

    fetchPosts();
    
  }, [userProfileVisiteid])

  const [blurBackground, setBlurBackground] = useState(false);
  useEffect(() => {
    if (isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp || isLikesPopUpOpen || openMediaViwerValue){
      setBlurBackground(true);
    }
    else{
      setBlurBackground(false);
    }
  }, [isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, openMediaViwerValue])

  
  return (
        
        <div className='feed'>
            <div className={blurBackground ? "feed-wrapper blur-background" : "feed-wrapper"}>
              {(!userProfileVisiteid || userProfileVisiteid === loggedInUser._id) && 
              <Share setEmojiOpen={setEmojiOpen} setSharePhotoBtnTrigger={setSharePhotoBtnTrigger}/> 
              }
              {loader ? 
                <div className='feed-loader-container'>
                  <CircularProgress size="40px" className="feed-loader" />
                </div> :
              <>

              { posts.length !== 0 ?
                    // this block of code shows the posts in the timeline and also in our own profile page
                    !userProfileVisiteid || userProfileVisiteid === loggedInUser._id ?
                      posts.map((p) => (
                        <Post key={p._id} post={p}/>
                      ))
                    :
                
                    loggedInUser.friends.includes(userProfileVisiteid) ?
                      // if we are on our friend's profile this runs
                      posts.filter(p => p.privacy !== "Onlyme").length !== 0 ?
                        posts.filter(p => p.privacy !== "Onlyme").map((p) => (
                          <Post key={p._id} post={p}/>
                        ))
                        :
                        <span className='noPosts'>No posts available</span>
                    :
                      // if we visit a profile that is not ours but also that is not our friend
                      posts.filter(p => p.privacy === "Public").length !== 0 ?
                        posts.filter(p => p.privacy === "Public").map((p) => (
                          <Post key={p._id} post={p}/>
                        ))
                        :
                        <span className='noPosts'>No posts available</span>

                :
                  <span className='noPosts'>No posts available</span>
              }

              </>
              } 
            </div>

            {isPop_upCommentOpen && <CommentSection openMediaViwerValue={openMediaViwerValue}/>}
            {isLikesPopUpOpen && <LikesSection />}

            {deletePostPopUp && 
                <DeletePostPopUp postId={deletePostPopUp} 
                                setDeletePostPopUp={setDeletePostPopUp}
                                loggedInUser={loggedInUser}
                                axiosJWT={axiosJWT}
                                accessToken={accessToken}
                />
            }

            {isPop_upSharePostOpen && 
                <SharePost  isPop_upSharePostOpen={isPop_upSharePostOpen} 
                            setIsPop_upSharePostOpen={setIsPop_upSharePostOpen}
                            loggedInUser={loggedInUser}
                            axiosJWT={axiosJWT}
                            accessToken={accessToken}
                            emojiOpen={emojiOpen} 
                            setEmojiOpen={setEmojiOpen}
                            sharePhotoBtnTrigger={sharePhotoBtnTrigger}
                            setSharePhotoBtnTrigger={setSharePhotoBtnTrigger}
                            openAlert={openAlert}
                            setOpenAlert={setOpenAlert}
                />
            }

            {openAlert &&
              <AlertPopUp openAlert={openAlert} setOpenAlert={setOpenAlert} />
            }

        </div>

  )

}

export default Feed;