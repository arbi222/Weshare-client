import "./alert.css";
import React from 'react'

const AlertPopUp = ({openAlert, setOpenAlert}) => {

  if (openAlert === "fileSize"){
    return (
        <div className="alert-container pop-up shadow">
            <h2>Failed to upload file!</h2>
            <p>The file you have selected is too large. The maximum allowed size is 30MB.</p>
            <button className='btn' type='button' onClick={() => setOpenAlert(false)}>Close</button>
        </div>
      )
  }
  else if (openAlert === "fileType"){
    return (
        <div className="alert-container pop-up">
            <h2>Failed to upload file!</h2>
            <p>The file you have selected is not an image or a video.</p>
            <button className='btn' type='button' onClick={() => setOpenAlert(false)}>Close</button>
        </div>
      )
  } 
  
}

export default AlertPopUp;