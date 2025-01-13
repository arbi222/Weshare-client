import React from 'react'
import "./deletePost.css"
import { Close } from "@mui/icons-material"
import { toast } from 'react-toastify'

const DeletePostPopUp = ({postId, setDeletePostPopUp, loggedInUser, axiosJWT, accessToken}) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const handleDeletePost = async () => {
        try{
            await axiosJWT.delete(apiUrl + "/posts/" + postId + "/" + loggedInUser._id, {data: {userId: loggedInUser._id}, headers: {authorization: `Bearer ${accessToken}`}});
            window.location.reload()
        }
        catch(err){
            toast.error("Error! Something went wrong!");
        }
    }

  return (
    <>
      <div className="pop-up delete-post-container shadow">

            <div className='delete-post-header'>
                <h2>Delete post?</h2>
                <button className='btn close-delete-post-popup'
                    title='Close' 
                    onClick={() => {setDeletePostPopUp(false)}}>
                    <Close style={{marginTop: "3px"}}/>
                </button>
            </div>

            <hr />

            <div>
                <h4 className='delete-post-question'>
                    Are you sure that you want to delete this post ?
                </h4>
                <div className='delete-post-btns'>
                    <button className='btn cancel-delete-btn' 
                            onClick={() => {setDeletePostPopUp(false)}}>
                        Cancel
                    </button>

                    <button className='btn delete-post-btn-pop-up'
                            onClick={handleDeletePost}>
                        Delete
                    </button>
                </div>
            </div>
  
        </div>
    </>
  )
}

export default DeletePostPopUp;
