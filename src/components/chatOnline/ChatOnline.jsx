import React, { useEffect, useState } from 'react'
import "./chatOnline.css"

const ChatOnline = ({userFriends, onlineFriends, searchTerm}) => {

  const [activeFriends, setActiveFriends] = useState([])
  const [offlineFriends, setOfflineFriends] = useState([]);

  useEffect(() => {
    setActiveFriends(userFriends.filter(f => onlineFriends.includes(f._id)));
    setOfflineFriends(userFriends.filter(f => !onlineFriends.includes(f._id)))
  },[userFriends, onlineFriends])

  const searchTerms = searchTerm.split(" ").filter(term => term.trim() !== "");
  const regexPatterns = searchTerms.map(term => new RegExp(term, "i"));

  const filteredFriends = [...activeFriends, ...offlineFriends].filter(friend => {
    const fullName = [friend.firstName, friend.middleName, friend.lastName].join(" ").toLowerCase();
    return regexPatterns.every(pattern => pattern.test(fullName));
  });

  return (
      <>
        {filteredFriends.length > 0 &&
          filteredFriends.map((friend) => {
            const isOnline = activeFriends.some(activeFriend => activeFriend._id === friend._id);
            return (
              <a
                className='rightbar-online'
                href={`http://localhost:5173/?user=${friend._id}`} 
                key={friend._id}
                referrerPolicy='no-referrer'
                target='_blank'
              >
                <div className="chatOnlineImgContainer">
                  <img
                    src={friend?.profilePicture ? friend.profilePicture
                      : friend?.gender === "Male" ? "/assets/person/male.jpg"
                      : "/assets/person/female.jpg"}
                    className='chatOnlineImg'
                    alt="User's Image"
                  />
                  {isOnline && <div className="chatOnlineBadge"></div>}
                </div>
                <span className="chatOnlineName">
                  {friend?.firstName + " " + (friend.middleName || "") + " " + friend?.lastName}
                </span>
              </a>
            );
          })
        }
      </>  
  )
}

export default ChatOnline;