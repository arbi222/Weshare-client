import React, { useState , useContext, useEffect} from 'react'
import "./search.css"
import { Search, ArrowBack} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { debounce } from "lodash"
import { AuthContext } from "../../context/AuthContext"
import { toast } from 'react-toastify';

const SearchBar = ({isSearchbarOpen, setisSearchbarOpen, axiosJWT, accessToken}) => {

  const { user: loggedInUser} = useContext(AuthContext);

  const [loader, setLoader] = useState(false);
  
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;
  
  const fetchUsers = debounce(async (searchQuery, aboutSignal) => {
    setLoader(true)
    if (!searchQuery) {
      setUsers([]);
      setLoader(false)
      return;
    }
    
    try {
      const response = await axiosJWT.get(`${apiUrl}/users/search/people?q=${searchQuery}&userId=${loggedInUser._id}`, {
        headers: {
            authorization: `Bearer ${accessToken}`
        },
        signal: aboutSignal,
      });
      setUsers(response.data);
      setLoader(false)
    } catch (error) {
      if (aboutSignal?.aborted){
        setLoader(false)
        return;
      }
      toast.error("Error! Could not get any user!")
      setLoader(false)
    }
  }, 700);      


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (query !== ""){
      fetchUsers(query, signal);
    }
    else{
      setUsers([]);
      setLoader(false)
    }

    return () => {
      controller.abort();
      setLoader(false);
    }
  }, [query]);


  return (
    <>
        <div className="searchbar">
            {isSearchbarOpen ? 
               <button className='close-search-bar' 
                       onClick={() => {setisSearchbarOpen(false)}}>
               <ArrowBack className='back-icon' style={{color:"#8a8a8a"}}/>
              </button> :
               <label htmlFor="search">
                 <Search className='search-icon' style={{color:"#8a8a8a"}} />
               </label>
            }

            <input id='search' 
                  placeholder='Search WeShare' 
                  className="search-Input" 
                  autoComplete='off' 
                  spellCheck="false"
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={() => {setisSearchbarOpen(true)}} 
            />

            {isSearchbarOpen && 
              <div className='search-results shadow search-scroll-bar'>
                
                  {loader ? 
                    <div className='loader-container'>
                      <CircularProgress size="20px" className="search-loader" />
                    </div>
                    :
                    <>
                      {users.length !== 0 &&
                        users.map(user => (
                          <div className='user-founded' key={user._id}>
                            <a href={`/profile/${user._id}`} referrerPolicy='no-referrer' className='user-founded-link'>
                              <div className='user-founded-info'>
                                <img src={
                                      user.profilePicture ? user.profilePicture : 
                                         user.gender === "Male" ? "/assets/person/male.jpg" : "/assets/person/female.jpg"
                                      }
                                     alt='profile pic' 
                                     className='searchppl-img'/>
                                <h4>{user.firstName + " " + user.middleName + " " + user.lastName}</h4>
                                {loggedInUser._id === user._id && <span style={{color: "grey"}}>You</span>}
                              </div>
                            </a>
                          </div>
                        ))
                      }
                    </>
                  }
                
              </div>
            }
        </div>
    </>
  )
}

export default SearchBar;