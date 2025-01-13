import React, {useContext, useEffect, useRef, useState} from 'react'
import "./blocklist.css"
import { ArrowBack } from '@mui/icons-material'
import { Link } from "react-router-dom"
import Navbar from '../../components/Navbar/Navbar'
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import BlockedUser from './blockedUser/BlockedUser'
import { toast } from 'react-toastify'

const Blocklist = () => {

    const { user: loggedInUser, dispatch, accessToken, axiosJWT, socket } = useContext(AuthContext);

    const apiUrl = process.env.REACT_APP_API_URL;
    const [loader, setLoader] = useState(true);
    const [blockedUsers, setBlockedUsers] = useState([]);

    useEffect(() => {
      const fetchBlockedUsers = async () => {
        setLoader(true);
        try {
          const requests = loggedInUser.blockList.map(userId =>
            axiosJWT.get(`${apiUrl}/users/getUser/${userId}/` + userId, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
          );
          const responses = await Promise.all(requests);
          setBlockedUsers(responses.map(response => response.data));
          setLoader(false);
        } catch (error) {
          toast.error("Error! Could not get the blocked users!")
          setLoader(false);
        }
      };

      fetchBlockedUsers();
    }, [loggedInUser.blockList, accessToken]);


    const [searchTerm, setSearchTerm] = useState("");

    const searchTerms = searchTerm.split(" ").filter(term => term.trim() !== "");
    const regexPatterns = searchTerms.map(term => new RegExp(term, "i"));

    const filteredBlockedUsers = blockedUsers.filter(user => {
      const fullName = [user.firstName, user.middleName, user.lastName].join(" ").toLowerCase();
      return regexPatterns.every(pattern => pattern.test(fullName));
    });

  return (
    <>
        <Navbar />    
        <main className="main-blocklist-container shadow">
            <div className='blocklist-header'>
                <Link className='btn go-back-block-btn' to="/settings" referrerPolicy='no-referrer'>
                    <ArrowBack style={{marginTop: "3px"}} />
                </Link>
                <h2>Manage Blocklist</h2>
            </div>
            
            <hr></hr>

            <p className='block-note'>Once you block someone, that person can no longer see things you post on your timeline, start a conversation with you, or add you as a friend.</p>

            {loggedInUser.blockList.length > 0 &&
              <div className='filter-blocked-section'>
                  <input type="text" 
                          className='filter-blocked-users'
                          placeholder='Search blocked users...'
                          autoComplete='off' 
                          spellCheck="false"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
            }
            
            <div className='blocked-users-container'>

                {loader ? 
                    <div className='blocklist-loader-container'>
                        <CircularProgress size="40px" className="blocklist-loader" />
                    </div>
                :
                    loggedInUser.blockList.length < 1 ? 
                        <div className='not-blocked-anyone'>
                            Your blocklist is empty!
                        </div>
                    :
                    filteredBlockedUsers.map((blockedUser, i) => (
                        <BlockedUser key={i} 
                                    loggedInUser={loggedInUser} 
                                    accessToken={accessToken} 
                                    axiosJWT={axiosJWT} 
                                    socket={socket} 
                                    dispatch={dispatch} 
                                    blockedUser={blockedUser}
                                    />        
                    )) 
                }

            </div>

        </main>

    </>
  )
}

export default Blocklist;