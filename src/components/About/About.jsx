import React from 'react'
import "./about.css"

const About = ({user, openMediaViwerValue}) => {
    

  return (
    <>
        <main className={openMediaViwerValue ? 'about-section shadow blur-background' : 'about-section shadow'}>
                    
            <h2>About {user.firstName}</h2>

            <hr className='about-hr'></hr>

            {user.bio && 
            <div className='about-item about-bio'>
                <p>{user.bio}</p>
            </div>
            }
            {user.state &&
            <div className='about-item about-grey-style'>
                <label>State</label>
                <p>{user.state}</p>
            </div>
            }
            {user.city &&
            <div className='about-item about-grey-style'>
                <label>City</label>
                <p>{user.city}</p>
            </div>
            }
            {user.work &&
            <div className='about-item about-grey-style'>
                <label>Work</label>
                <p>{user.work}</p>
            </div>
            }
            {user.school && 
            <div className='about-item about-grey-style'>
                <label>School</label>
                <p>{user.school}</p>
            </div>
            }
            {user.age && 
            <div className='about-item about-grey-style'>
                <label>Age</label>
                <p>{user.age}</p>
            </div>
            }
            {user.relationship && 
            <div className='about-item about-grey-style'>
                <label>Relationship</label>
                <p>{user.relationship}</p>
            </div>
            }   
            {user.gender && 
            <div className='about-item about-grey-style'>
                <label>Gender</label>
                <p>{user.gender}</p>
            </div>
            }       
        </main>
    </>
  )
}

export default About;
