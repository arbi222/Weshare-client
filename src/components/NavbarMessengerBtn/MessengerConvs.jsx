import { CircularProgress } from "@mui/material";
import "./messengerConvs.css"
import React, { useEffect, useState } from 'react'
import Conversation from "./Conversation/Conversation";


const MessengerConvs = ({loggedInUser, conversations, accessToken, axiosJWT, setConversations, setDeletedConv, socket, setMessengerBtnActive}) => {

    const [loader, setLoader] = useState(true);

    useEffect(() => {
        setTimeout(() => {
          setLoader(false)
        }, 1000)
    },[])


    const [onlineFriends, setOnlineFriends] = useState([]);
    useEffect(() => {
      socket.current.emit("addUser", loggedInUser._id);
    
      const handleGetUsers = (users) => {
        setOnlineFriends(
          loggedInUser.friends.filter((friendId) =>
            users.some((usr) => usr.userId === friendId)
          )
        );
      };
      socket.current.on("getUsers", handleGetUsers);
    
      return () => {
        socket.current.off("getUsers", handleGetUsers);
      };
    }, [conversations, loggedInUser.friends, loggedInUser._id, socket.current]);

  return (
    <div className="messenger-dropdown scroll-bar shadow">

        <div className="messenger-dropdown-header">
            <h2>Conversations</h2>
            <a className="btn" referrerPolicy='no-referrer' href="https://wesharemessenger.onrender.com" target="_blank" title="Open Weshare-Messenger">
                <img src="/assets/favicon/messengerLogo.png" alt="logo" />
            </a>
        </div>
          
          <div className='messenger-conversations'>
            {loader ? 
                <div className='messenger-loader-container'>
                  <CircularProgress size="30px" className="messenger-loader" />
                </div>
              :
              conversations.length !== 0 ?
                  conversations.map((conv) => (
                          <Conversation key={conv._id} 
                                        conv={conv}
                                        setDeletedConv={setDeletedConv}
                                        loggedInUser={loggedInUser}
                                        accessToken={accessToken}
                                        axiosJWT={axiosJWT}
                                        setConversations={setConversations}
                                        socket={socket}
                                        onlineFriends={onlineFriends}
                                        setMessengerBtnActive={setMessengerBtnActive}
                                        />
                      )
                  )
              :
              <p className="no-conv">Your conversation list is empty.</p>
            }
          </div>

    </div>
  )
}

export default MessengerConvs;
