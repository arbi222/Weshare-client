import React from "react";
import { Flip, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


const ToastNotification = () => {
    return (
        <div>
            <ToastContainer transition={Flip} autoClose={3000} position="bottom-right"/>
        </div>
    )
}

export default ToastNotification;