import React, {useContext, useEffect, useState, useRef} from 'react'
import "./navbar.css";
import SearchBar from '../NavbarSearch/SearchBar';
import AccButton from '../NavbarAccountBtn/AccButton';
import NotificationBtn from '../NavbarNotificationBtn/NotificationBtn';
import { Notifications , Chat } from '@mui/icons-material';
import { AuthContext } from "../../context/AuthContext"
import MessengerConvs from '../NavbarMessengerBtn/MessengerConvs';
import { toast } from 'react-toastify'
import playSound from '../../lib/sounds';


const Navbar = ({isPop_upPassOpen, isPop_upDeleteAccOpen, isPop_upTFAOpen}) => {

  const { user, socket, axiosJWT, accessToken, dispatch, isPop_upSharePostOpen , 
          isPop_upCommentOpen, deletePostPopUp , isLikesPopUpOpen, openMediaViwerValue} = useContext(AuthContext);

  const [isAccBtnActive, setAccBtnActive] = useState(false);
  const accBtnMenu = useRef();

  const [isNotificationBtnActive, setNotificationBtnActive] = useState(false);
  const notificationMenu = useRef();
  const [notifications, setNotifications] = useState([]);
  const [unReadNotifications, setUnReadNotifications] = useState(0)
  const [deletedSingleNotification, setDeletedSingleNotification] = useState(false)
  const [notificationChanges, setNotificationChanges] = useState(false)

  const [isSearchbarOpen, setisSearchbarOpen] = useState(false)
  const searchbarRef = useRef();

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getNotifications = async () => {
      try{
        const res = await axiosJWT.get(apiUrl + "/notifications/" + user._id , {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
        });
        setNotifications(res.data.sort((n1,n2) => {
          return new Date(n2.createdAt) - new Date(n1.createdAt);
        }))
      }
      catch(err){
        toast.error("Error! Could not get the notifications!")
      }
    }
    getNotifications()
  },[isNotificationBtnActive, unReadNotifications, deletedSingleNotification, notificationChanges])

  useEffect(() => {
    setUnReadNotifications(notifications.map(notification => notification).filter(readNotification => readNotification.read === false).length)
  },[notifications])

  useEffect(() => {
    socket.current.on("getNotification", (data) =>{
      setNotifications((prev) => [data, ...prev])
      setUnReadNotifications((prev) => prev + 1)
      playSound();
    })

    return () => {
      socket.current.off("getNotification");
    };
  },[socket.current])

  useEffect(() => {
    socket.current.on("updateNotifications", (data) =>{
      setUnReadNotifications((prev) => prev - 1)
    })

    return () => {
      socket.current.off("updateNotifications");
    };
  },[socket.current])

  const messengerMenu = useRef();
  const [isMessengerBtnActive, setMessengerBtnActive] = useState(false);
  const [unReadMessages, setUnReadMessages] = useState(0)

  const [conversations, setConversations] = useState([]);
  const [deletedConv, setDeletedConv] = useState(false);

    const getConversations = async () =>{
        try{
            const res = await axiosJWT.get(apiUrl + "/conversations/" + user._id, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            });

            const conversationWithUserDetails = await Promise.all(
                res.data.map(async (conv) => {
                    const userRes = await axiosJWT.get(`${apiUrl}/users/getUser/${conv.receiverId}/${user._id}/?getBlocked=true`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`
                        }
                    });
                    return {
                        ...conv,
                        receiverUser: userRes.data
                    }
                })
            )

            setConversations(conversationWithUserDetails.sort((a,b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt)
            }));
            setDeletedConv(false);
        }
        catch(err){
          toast.error("Error! Could not get the conversations!")
        }
    }

    useEffect(()=> {
        getConversations();
    },[user._id, deletedConv, isMessengerBtnActive])

  useEffect(() => {
    setUnReadMessages(conversations.map(conv => conv).filter(readMessage => readMessage.isSeen === false).length);
  },[conversations])

  useEffect(() => {
    socket.current.on("getConversation", (data) =>{
      const { receiverId, chatId, lastMessage, isSeen } = data;

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) =>
            conv.chatId === chatId && conv.receiverId === receiverId
                ? {...conv, lastMessage: lastMessage, isSeen: isSeen, updatedAt: Date.now()}
                : conv
            );

        return updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      });
      setUnReadMessages((prev) => prev + 1);

      return () => {
        socket.current.off("getConversation");
      };
      
    })
  },[socket])

  const [receivedMessage, setReceivedMessage] = useState(false)

  useEffect(() => {
    if (receivedMessage){
      playSound();
      setReceivedMessage(false)
    }
  }, [receivedMessage])

  useEffect(() => {
      socket.current.on("getMessage", data => {
        setReceivedMessage(true);
        getConversations()
      })
      return () => {
          socket.current.off("getMessage");
        };
  },[socket])

  useEffect(() => {
    if (isAccBtnActive || isNotificationBtnActive || isSearchbarOpen || isMessengerBtnActive){
      const handleNavButtons = (e) => {
        if (!accBtnMenu.current.contains(e.target)){
          setAccBtnActive(false);
        }
        if (!notificationMenu.current.contains(e.target)){
          setNotificationBtnActive(false);
        }
        if (!searchbarRef.current.contains(e.target)){
          setisSearchbarOpen(false);
        }
        if (!messengerMenu.current.contains(e.target)){
          setMessengerBtnActive(false);
        }
      }
  
      document.addEventListener("mousedown", handleNavButtons);

      return () => {
        document.removeEventListener("mousedown", handleNavButtons);
      }
    }
  }, [isAccBtnActive, isNotificationBtnActive, isSearchbarOpen, isMessengerBtnActive])

  const [blurBackground, setBlurBackground] = useState(false);
  useEffect(() => {
    if (isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp || isLikesPopUpOpen || 
        openMediaViwerValue || isPop_upPassOpen || isPop_upDeleteAccOpen || isPop_upTFAOpen){
          setBlurBackground(true);
    }
    else{
      setBlurBackground(false);
    }
  }, [isPop_upSharePostOpen, isPop_upCommentOpen, 
      deletePostPopUp, isLikesPopUpOpen, openMediaViwerValue,
      isPop_upPassOpen, isPop_upDeleteAccOpen, isPop_upTFAOpen])
  
  return (

    <div className={blurBackground ? 'navbar-container shadow blur-background' : 'navbar-container shadow'}>
        <div className={isSearchbarOpen ? "navbar-left-searchbar" : "navbar-left"}>
          <a href="/" referrerPolicy='no-referrer' style={{textDecoration:"none"}}>
            <span className='nav-logo'>WeShare</span>
          </a>
        </div>
        <div className="navbar-center" ref={searchbarRef}>
          <SearchBar isSearchbarOpen={isSearchbarOpen} setisSearchbarOpen={setisSearchbarOpen} axiosJWT={axiosJWT} accessToken={accessToken} />    
        </div>
        <div className={isSearchbarOpen ? "navbar-right-searchbar" : "navbar-right"}>
          <div className="navbar-Icons">
            <div style={{position: "relative"}} ref={notificationMenu}>
              <div className="navbar-icon-item btn nav-btn" 
                    onClick={() => {setNotificationBtnActive(!isNotificationBtnActive)}}    
                    title='Notifications'>
                <Notifications className='chat-notification-icon' />
                {unReadNotifications !== 0 && 
                  <span className="navbar-icon-badge">{unReadNotifications}</span>
                }
              </div>
              {isNotificationBtnActive && 
                  <NotificationBtn notifications={notifications} 
                                  loggedInUser={user}
                                  setUnReadNotifications={setUnReadNotifications}
                                  setDeletedSingleNotification={setDeletedSingleNotification}
                                  setNotificationChanges={setNotificationChanges}
                                  axiosJWT={axiosJWT} 
                                  accessToken={accessToken}
                  />
              }
            </div>
            
            <div style={{position: "relative"}} ref={messengerMenu}>
              <div className="navbar-icon-item btn nav-btn" 
                    title='Conversations'
                    onClick={() => {setMessengerBtnActive(!isMessengerBtnActive)}}>

                  <Chat className='chat-notification-icon' />
                  {unReadMessages !== 0 &&
                    <span className="navbar-icon-badge">{unReadMessages}</span>
                  }
              </div>
              {isMessengerBtnActive && 
                <MessengerConvs loggedInUser={user}
                                conversations={conversations}
                                setConversations={setConversations}
                                setDeletedConv={setDeletedConv}
                                socket={socket}
                                accessToken={accessToken}
                                axiosJWT={axiosJWT}
                                setMessengerBtnActive={setMessengerBtnActive}
                                 />
              }
            </div>
            
            
            <div style={{position: "relative"}} ref={accBtnMenu}>
              <div className="navbar-icon-item btn acc-btn" title='Account'>
                <img className='account-picture' 
                     src={
                      user.profilePicture ? user.profilePicture : 
                      
                      user.gender === "Male" ? 
                      "/assets/person/male.jpg" :
                      "/assets/person/female.jpg"
                    } 
                      alt="User's Image"
                      onClick={() => setAccBtnActive(!isAccBtnActive)}         
                />
              </div>
              {isAccBtnActive && <AccButton user={user} dispatch={dispatch} />}
            </div>
          </div>
        </div>
    </div>

  )

}

export default Navbar
