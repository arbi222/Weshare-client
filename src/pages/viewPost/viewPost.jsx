import React, {useEffect} from 'react'
import { useParams } from 'react-router';
import CommentSection from '../../pop-ups/commentSection/CommentSection';
import Navbar from '../../components/Navbar/Navbar'
import LikesSection from '../../pop-ups/likesSection/likesPopUp';
import DeletePostPopUp from '../../pop-ups/deletePost/DeletePostPopUp';
import SharePost from '../../pop-ups/sharePost/SharePost';
import MediaViwer from '../../pop-ups/mediaViwer/MediaViwer';

const PostPage = (props) => {

    const postId = useParams().id;

    useEffect(() => {
      const handleKeydown = (objEvent) => {
        if (objEvent.isComposing || objEvent.keyCode === 9) {
          objEvent.preventDefault(); 
        }
      };
    
      if (props.isLikesPopUpOpen || props.deletePostPopUp || props.isPop_upSharePostOpen || props.openMediaViwerValue) {
        document.body.style.overflow = 'hidden'; 
        document.body.addEventListener("keydown", handleKeydown); 
      } else {
        document.body.style.overflow = 'unset'; 
      }

      return () => {
        document.body.style.overflow = 'unset';
        document.body.removeEventListener("keydown", handleKeydown); 
      };
    }, [props.isLikesPopUpOpen, props.deletePostPopUp, props.isPop_upSharePostOpen, props.openMediaViwerValue]);

    return <>
        <Navbar />
        <CommentSection pagePostId={postId} openMediaViwerValue={props.openMediaViwerValue}/>
        {props.isLikesPopUpOpen && <LikesSection />}

        {props.deletePostPopUp && 
            <DeletePostPopUp postId={props.deletePostPopUp} 
                            setDeletePostPopUp={props.setDeletePostPopUp}
                            loggedInUser={props.loggedInUser}
                            accessToken={props.accessToken}
                            axiosJWT={props.axiosJWT}
            />
        }

        {props.isPop_upSharePostOpen && 
            <SharePost  isPop_upSharePostOpen={props.isPop_upSharePostOpen} 
                        setIsPop_upSharePostOpen={props.setIsPop_upSharePostOpen}
                        loggedInUser={props.loggedInUser}
                        accessToken={props.accessToken}
                        axiosJWT={props.axiosJWT}
            />
        }

      {props.openMediaViwerValue &&
        <MediaViwer mediaViwer={props.mediaViwer} setOpenMediaViwerValue={props.setOpenMediaViwerValue} />
      }
    </>
}

export default PostPage;