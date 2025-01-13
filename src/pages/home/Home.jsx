import React, { useContext , useEffect } from 'react'
import "./home.css"
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar';
import Feed from '../../components/Feed/Feed';
import Rightbar from '../../components/Rightbar/Rightbar';
import MediaViwer from '../../pop-ups/mediaViwer/MediaViwer';

const Home = () => {

  const {isPop_upSharePostOpen , isPop_upCommentOpen , deletePostPopUp, isLikesPopUpOpen, openMediaViwerValue, mediaViwer, setOpenMediaViwerValue} = useContext(AuthContext);

  useEffect(() => {
    const handleKeydown = (objEvent) => {
      if (objEvent.isComposing || objEvent.keyCode === 9) {
        objEvent.preventDefault();
      }
    };
  
    if (isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp || isLikesPopUpOpen || openMediaViwerValue) {
      document.body.style.overflow = 'hidden';
      document.body.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = 'unset';
    }
  
    return () => {
      document.body.style.overflow = 'unset'; 
      document.body.removeEventListener("keydown", handleKeydown); 
    };
  }, [isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen, openMediaViwerValue]);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
      {openMediaViwerValue &&
        <MediaViwer mediaViwer={mediaViwer} setOpenMediaViwerValue={setOpenMediaViwerValue} />
      }
    </>
  )
}

export default Home;