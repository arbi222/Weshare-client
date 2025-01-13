import React, { useState } from 'react'
import "./gallery.css"
import SingleFile from './SingleFile/SingleFile';

const Gallery = ({user, loggedInUser , accessToken, axiosJWT, openMediaViwerValue, setOpenMediaViwerValue, setMediaViwer}) => {

    const [photosActive, setPhotosActive] = useState(true);
    const [videosActive, setVideosActive] = useState(false);

  return (
    <>
        <main className={openMediaViwerValue ? 'photos-section shadow blur-background' : 'photos-section shadow'}>

            <div className='choice-btns'>
                <button className={photosActive ? 'btn choice-btn-active' : 'btn'} 
                        onClick={() => {setPhotosActive(true)
                                        setVideosActive(false)}}>
                        Photos
                </button>
                <button className={videosActive ? 'btn choice-btn-active' : 'btn'} 
                        onClick={() => {setPhotosActive(false)
                                        setVideosActive(true)}}>
                        Videos
                </button>
            </div>

            <hr className='photos-hr'></hr>
            
            {user._id === loggedInUser._id ?
                <h2>{photosActive ? `Photos (${user.images.length})` : `Videos (${user.videos.length})`}</h2>
            :
                <h2>{photosActive ? `${user.firstName}'s Photos (${user.images.length})` : `${user.firstName}'s Videos (${user.videos.length})`}</h2> 
            }
            
            {photosActive ?
                user.images.length !== 0 ?
                    <div className='photos-pattern'>
                        {user.images.map((image,i) => {
                            return (
                                <div key={i} className='image-div'>
                                    <SingleFile image={image} 
                                                user={user} 
                                                loggedInUser={loggedInUser} 
                                                accessToken={accessToken} 
                                                axiosJWT={axiosJWT}
                                                setOpenMediaViwerValue={setOpenMediaViwerValue}
                                                setMediaViwer={setMediaViwer} />
                                </div>
                            )
                        })}
                    </div>
                :
                <div className='no-photos'>
                    <h4>{user._id === loggedInUser._id ? 
                        "You have not posted any photo yet!" : 
                        `${user.firstName} has not posted any photo yet!`}
                    </h4>
                </div>  
                    
            :
                user.videos.length !== 0 ?
                    <div className='photos-pattern'>
                        {user.videos.map((video,i) => {
                            return (
                                <div key={i} className='image-div'>
                                    <SingleFile video={video} 
                                                user={user} 
                                                loggedInUser={loggedInUser} 
                                                accessToken={accessToken} 
                                                axiosJWT={axiosJWT}
                                                setOpenMediaViwerValue={setOpenMediaViwerValue}
                                                setMediaViwer={setMediaViwer} />
                                </div>
                            )
                        })}
                    </div>
                :
                <div className='no-photos'>
                    <h4>{user._id === loggedInUser._id ? 
                        "You have not posted any video yet!" : 
                        `${user.firstName} has not posted any video yet!`}
                    </h4>
                </div> 
            }

        </main>
    </>
  )
}

export default Gallery;