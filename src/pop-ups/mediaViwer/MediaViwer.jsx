import React from 'react'
import "./mediaViwer.css"
import { Close } from '@mui/icons-material'

const MediaViwer = ({mediaViwer, setOpenMediaViwerValue}) => {

    if (!mediaViwer.fileUrl){
        setOpenMediaViwerValue(false)
        return;
    }

  return (
    <div className='pop-up media-viwer shadow'>
      
        <div className='media-viwer-header'>
            <span className='btn close-media-viwer-btn' title='Close'
                    onClick={() => {setOpenMediaViwerValue(false)}}>
                    <Close style={{marginTop: "3px"}}/>
            </span>
        </div>

        <div className='media-center'>
            {mediaViwer.fileType === "image" && 
                <img src={mediaViwer.fileUrl} alt="photo" /> 
            }
            {mediaViwer.fileType === "video" && 
                <video src={mediaViwer.fileUrl} controls alt="video" />
            }
        </div>

    </div>
  )
}

export default MediaViwer;