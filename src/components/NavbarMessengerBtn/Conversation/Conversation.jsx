import "./conversation.css"
import React, { useState, useEffect } from 'react'
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify'

const Conversation = ({conv, setDeletedConv, loggedInUser, accessToken, axiosJWT, setConversations, socket, onlineFriends, setMessengerBtnActive}) => {

    const [deletedBtnClicked, setDeletedBtnState] = useState(false)
    const [mouseOver, setMouseOver] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    const handleDeleteConv = async (conv) => {
        try{
          if (loggedInUser._id !== conv.receiverUser._id){  // deleting the conversation with other people
            const res = await axiosJWT.post(`${apiUrl}/conversations/find_or_create?find=true`, 
                      {conversationOwner: conv.receiverId, 
                        receiverId: conv.conversationOwner
                      } , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.state !== "exists"){
              await axiosJWT.delete(`${apiUrl}/conversations/${conv._id}` , {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
              });
              await axiosJWT.delete(`${apiUrl}/chats/${conv.chatId}` , {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
              });
            }
            else{
              await axiosJWT.put(`${apiUrl}/chats`, {
                chatId: conv.chatId,
                userId: loggedInUser._id,
                timestamp: new Date() }, {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
                }
              );
              await axiosJWT.delete(`${apiUrl}/conversations/${conv._id}`, {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
              });
            }          
          }
          else{ // deleting our own conversation
            await axiosJWT.delete(`${apiUrl}/conversations/${conv._id}` , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
            });
            await axiosJWT.delete(`${apiUrl}/chats/${conv.chatId}` , {
              headers: {
                  authorization: `Bearer ${accessToken}`
              }
            });
          }
          setTimeout(() => {
            setDeletedConv(true);
          }, 500);
        }
        catch(err){
          toast.error("Error! Something went wrong!")
        }
    }

    const handleSeenConv = async (conversation) => {
        if (!conversation.isSeen){
            try{
                await axiosJWT.put(apiUrl + "/conversations/" + conversation._id, {isSeen: true} , {
                  headers: {
                      authorization: `Bearer ${accessToken}`
                  }
                });
            }
            catch(err){
              toast.error("Error! Something went wrong!")
            }

            socket.current.emit("seeMessage", {
                senderId: loggedInUser._id,
                receiverId: conversation.receiverUser._id,
                haveSeen: true
            })
            
            setConversations((prevConversations) => {
                return prevConversations.map((conv) =>
                        conv.chatId === conversation.chatId && conv.receiverId === conversation.receiverId
                            ? {...conv, isSeen: true}
                            : conv
                )
            })
        }
    }

    
    const [isOnline, setIsOnline] = useState(false);
    useEffect(() => {
      setIsOnline(onlineFriends.includes(conv.receiverId));
    }, [conv])

  return (
    <div className={deletedBtnClicked ? "single-conversation delete-conversation-animation" : "single-conversation"} 
        onMouseOver={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
       >
        <a className="conv-info" 
          href={`https://wesharemessenger.onrender.com/?conversation=${conv._id}`} 
          target="_blank"
          referrerPolicy='no-referrer' 
          onClick={() => {handleSeenConv(conv)
                  setMessengerBtnActive(false)}}>
            <div className="img-badge">
              <img src={(conv.receiverUser.state !== "blockedByYou" && conv.receiverUser !== "blockedByThem") ?
                      conv.receiverUser.profilePicture ? conv.receiverUser.profilePicture :
                         conv.receiverUser.gender === "Male" ? 
                          "/assets/person/male.jpg" :
                          "/assets/person/female.jpg"
                      :
                      "/assets/person/blockedUser.png"
                      } 
                  alt="profile picture" 
              />
              {isOnline && <div className="onlineBadge"></div>}
            </div>
            <div>
                <h4>
                {(conv.receiverUser.state !== "blockedByYou" && conv.receiverUser !== "blockedByThem") ? 
                      conv.receiverUser.firstName + " " 
                    + conv.receiverUser.middleName + " " 
                    + conv.receiverUser.lastName
                    :
                    "User"
                }
                </h4>
                <p style={{color: !conv.isSeen ? "#000" : "", fontWeight: !conv.isSeen ? "bold" : ""}}>{conv.lastMessage}</p>
            </div>
        </a>
        
        <div className="conv-buttons">
            {mouseOver &&
                <div className='delete-button-div'>
                    <button title='Delete conversation' 
                            onClick={() => {handleDeleteConv(conv)
                                            setDeletedBtnState(true)}
                                    }
                            className="btn"          
                    >
                      <Delete style={{marginTop: "3px"}}/>
                    </button>
                </div>
            }
            {!conv.isSeen &&
                <button title='Mark as seen' onClick={() => handleSeenConv(conv)} className='blue-dot shadow'></button>
            }
        </div>
        
    </div>
  )
}

export default Conversation;
