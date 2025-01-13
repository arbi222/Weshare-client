import React, { useContext } from "react";
import {BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import PostPage from "./pages/viewPost/viewPost";
import ResetPassPage from "./pages/resetPass/resetPass";
import Login from "./pages/login/Login";
import Settings from "./pages/settings/Settings";
import BasicInfo from "./pages/basicSettings/BasicInfo";
import Advanced from "./pages/advancedSettings/Advanced";
import Blocklist from "./pages/manageBlocklist/Blocklist";
import { AuthContext } from "./context/AuthContext";
import ToastNotification from "./components/ReactNotification/ToastNotification";


function App() {

  const { user, axiosJWT, accessToken, loading, isLikesPopUpOpen , deletePostPopUp, setDeletePostPopUp,
        isPop_upSharePostOpen, setIsPop_upSharePostOpen, openMediaViwerValue, mediaViwer, setOpenMediaViwerValue} = useContext(AuthContext);

  return (
    <Router>
      {!loading &&
        <Routes>

          <Route path="/" element={user && accessToken ? <Home /> : <Login />}></Route>
          <Route path="/login" element={user && accessToken ? <Navigate to="/" replace={true} /> : <Login />}></Route>
          <Route path="/settings" element={user && accessToken ? <Settings /> : <Login />}></Route>
          <Route path="/settings/basic-info" element={user && accessToken ? <BasicInfo /> : <Login />}></Route>
          <Route path="/settings/advanced" element={user && accessToken ? <Advanced /> : <Login />}></Route>
          <Route path="/settings/blocklist" element={user && accessToken ? <Blocklist /> : <Login />}></Route>
          <Route path="/profile/:id" element={user && accessToken ? <Profile /> : <Login />}></Route>
          <Route path="/post/:id" 
                element={user && accessToken ? 
                        <PostPage isLikesPopUpOpen={isLikesPopUpOpen} 
                                  deletePostPopUp={deletePostPopUp}
                                  setDeletePostPopUp={setDeletePostPopUp}
                                  isPop_upSharePostOpen={isPop_upSharePostOpen}
                                  setIsPop_upSharePostOpen={setIsPop_upSharePostOpen}
                                  loggedInUser={user}
                                  axiosJWT={axiosJWT}
                                  accessToken={accessToken}
                                  openMediaViwerValue={openMediaViwerValue}
                                  setOpenMediaViwerValue={setOpenMediaViwerValue}
                                  mediaViwer={mediaViwer}
                        /> : 
                        <Login />
                }>
          </Route>
          <Route path="/reset-password/:token" element={user && accessToken ? <Home /> : <ResetPassPage />}></Route>
                
          <Route path="*" element={user && accessToken ? <Home /> : <Login />}></Route>
     
        </Routes>
      }

      <ToastNotification />
    </Router>
  );
}

export default App;