import React, {useContext , useState, useRef} from 'react'
import { Link } from "react-router-dom"
import "./basicinfo.css"
import { ArrowBack } from '@mui/icons-material';
import Navbar from '../../components/Navbar/Navbar'
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ToastNotification from '../../components/ReactNotification/ToastNotification';


const BasicInfo = () => {

  const { user: loggedInUser, accessToken, axiosJWT } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;

  const bio = useRef();
  const work = useRef();
  const school = useRef()
  const state = useRef()
  const city = useRef()

  const options = [
    {value: "", text: "Status not specified"},
    {value: "Single", text: "Single"},
    {value: "In a relationship", text: "In a relationship"},
    {value: "Engaged", text: "Engaged"},
    {value: "Married", text: "Married"},
    {value: "Separated", text: "Separated"},
    {value: "Divorced", text: "Divorced"},
    {value: "It's complicated", text: "It's complicated"},
  ]

  const [selected, setSelected] = useState(loggedInUser.relationship);

  const handleSelectChange = (e) => {
    setSelected(e.target.value);
  }

  
  const updateBasicSettings = async (e) => {
    e.preventDefault();

    const updateUser = {
        userId: loggedInUser._id,
        bio: bio.current.value.charAt(0).toUpperCase() + bio.current.value.slice(1),
        work: work.current.value.charAt(0).toUpperCase() + work.current.value.slice(1),
        school: school.current.value.charAt(0).toUpperCase() + school.current.value.slice(1),
        state: state.current.value.charAt(0).toUpperCase() + state.current.value.slice(1),
        city: city.current.value.charAt(0).toUpperCase() + city.current.value.slice(1),
        relationship: selected,
    }

    try{
        await axiosJWT.put(apiUrl + "/users/" + loggedInUser._id, updateUser , {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
          })
        toast.success("Settings saved!");
    }
    catch(err){
        toast.error("Settings were not saved!");
    }

  }
 
  return (
    <>
        <Navbar />
        <div className='main-basic-container shadow'>

            <div className='main-header'>
                <Link className='btn go-back-basic-btn' to="/settings" referrerPolicy='no-referrer'>
                    <span><ArrowBack style={{marginTop: "3px"}}/></span>
                </Link>
                <h2>Basic Information</h2>
            </div>
            
            <hr></hr>
            <form onSubmit={updateBasicSettings}>
                <div className='info-section'>
                    <label htmlFor='bio' className='basic-sett-labels'>Bio</label>
                    <textarea id='bio' 
                              cols="31" 
                              rows="3" 
                              maxLength="130" 
                              placeholder='Describe yourself...'
                              defaultValue={loggedInUser.bio}
                              ref={bio}>
                    </textarea>
                </div>

                <hr className='hr-seperations-basic'></hr>

                <div className='info-section'>
                    <label htmlFor='work' className='basic-sett-labels'>Work</label>
                    <input id='work' 
                           className='input-basic' 
                           type='text' 
                           placeholder='Add your workplace...'
                           defaultValue={loggedInUser.work}
                           ref={work}
                           >
                    </input>
                </div>

                <hr className='hr-seperations-basic'></hr>

                <div className='info-section'>
                    <label htmlFor='school' className='basic-sett-labels'>School</label>
                    <input id='school' 
                           className='input-basic' 
                           type='text' 
                           placeholder='Add your school...'
                           defaultValue={loggedInUser.school}
                           ref={school}
                           >
                    </input>
                </div>

                <hr className='hr-seperations-basic'></hr>

                <div className='info-section'>
                    <label htmlFor='state' className='basic-sett-labels'>State</label>
                    <input id='state' 
                           className='input-basic' 
                           type='text' 
                           placeholder='Add your state...'
                           defaultValue={loggedInUser.state}
                           ref={state}
                           >
                    </input>
                </div>

                <hr className='hr-seperations-basic'></hr>

                <div className='info-section'>
                    <label htmlFor='city' className='basic-sett-labels'>City</label>
                    <input id='city' 
                           className='input-basic' 
                           type='text' 
                           placeholder='Add your city...'
                           defaultValue={loggedInUser.city}
                           ref={city}
                           > 
                    </input>
                </div>  

                <hr className='hr-seperations-basic'></hr> 

                <div className='info-section'>
                    <label className='basic-sett-labels'>Relationship</label>
                    <select className='select' value={selected} onChange={handleSelectChange}>
                        {options.map((o,i) => (
                            <option key={i} value={o.value}>{o.text}</option>
                        ))}
                    </select>
                </div> 

                <hr></hr>

                <button type='submit' className='btn save-changes-btn'>Save Changes</button>
            </form>
        </div>

        <ToastNotification />
    </>
  )
}

export default BasicInfo;