import React, { useState, useRef, useContext , useEffect} from 'react'
import "./likesSection.css"
import { Close } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Likes from '../../components/Likes/Likes';
import { toast } from 'react-toastify';


const LikesSection = () => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const {user: loggedInUser, accessToken, axiosJWT, isLikesPopUpOpen, setLikesPopUpOpen} = useContext(AuthContext);

    const [likeOwnerIds, setLikeOwnerIds] = useState([]);

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        const fetchLikes = async () => {
            try{
                setLoader(true)
                if (isLikesPopUpOpen){
                    const res = await axiosJWT.get(apiUrl + "/posts/post/" + isLikesPopUpOpen + "/" + loggedInUser._id , {
                            headers: {
                                authorization: `Bearer ${accessToken}`
                            }
                    });
                    setLikeOwnerIds(res.data.likes);
                    setTimeout(() => {
                        setLoader(false)
                    },1000)
                    
                }
            }
            catch(err){
                toast.error("Error! Could not get the likes!")
                setLoader(false)
            }
        }

        fetchLikes()
    },[isLikesPopUpOpen])


  return (
        <>
            <main className='likes-container pop-up shadow'>
                
                <div className='main-likes-header'>
                    <h2>Likes</h2>
                    <span className='btn close-btn' title='Close'
                            onClick={() => setLikesPopUpOpen(false)}>
                            <Close style={{marginTop: "3px"}}/>
                    </span>
                </div>

                <hr className='hr-likes-Popup'></hr>

                <div className='scroller'>
                    {loader ? 
                        <div className='feed-loader-container'>
                            <CircularProgress size="40px" className="feed-loader" />
                        </div> 
                        :
                        <>  
                            {likeOwnerIds.length !== 0 ?
                                <>
                                    {likeOwnerIds.reverse().map((likeOwnerId) => (
                                        <Likes key={likeOwnerId} likeOwnerId={likeOwnerId} accessToken={accessToken} axiosJWT={axiosJWT} loggedInUser={loggedInUser} />
                                    ))}
                                </> :

                                <div className='no-likes'>This post has no likes yet!</div>
                            }
                        </>
                    }
                </div>

            </main>
        </>
  )
}

export default LikesSection;