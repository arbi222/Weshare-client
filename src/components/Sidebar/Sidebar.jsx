import React, { useState , useContext , useEffect } from 'react'
import "./sidebar.css"
import { Close , Settings } from '@mui/icons-material';
import { Link } from "react-router-dom"
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () =>{

    const {user: loggedInUser, isPop_upSharePostOpen, 
        deletePostPopUp, isPop_upCommentOpen, isLikesPopUpOpen, 
        openMediaViwerValue, axiosJWT, accessToken} = useContext(AuthContext);

    const apiUrl = process.env.REACT_APP_API_URL;
    const [isWeatherTabOn, setIsWeatherTabOn] = useState(false);

    const [weatherData, setWeatherData] = useState({});
    const [alert, setAlert] = useState("");

    const [loader, setloader] = useState(false);


    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        let timer;

        if (isWeatherTabOn){
            setIsVisible(false);
        }
        else{
            timer = setTimeout(() => {
                setIsVisible(true);
          }, 1000);
        }
    
        return () => clearTimeout(timer);
    }, [isWeatherTabOn]);

    const weatherHandler = async () => {
        
        setIsWeatherTabOn(true)

        function isEmptyOrSpaces(str){
            return str === null || str.match(/^ *$/) !== null;
        }

        try{
            setloader(true)
            if (!isEmptyOrSpaces(loggedInUser?.city)){
                const res = await axiosJWT.post(apiUrl + "/weather/", {city: loggedInUser?.city}, {
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                });
                setWeatherData(res.data)
                setloader(false)
            }
            else{
                setloader(false)
                setAlert("You have not added a city yet! Go to settings to add it now.");
            }
        }
        catch(err){
            setloader(false)
            setAlert(err.response.data);
        }
    }

    const [blur, setBlur] = useState(false)
    useEffect(() => {
        if (openMediaViwerValue || isPop_upSharePostOpen || isPop_upCommentOpen || deletePostPopUp || isLikesPopUpOpen) {
            setBlur(true);
        }
        else{
            setBlur(false);
        }
    }, [openMediaViwerValue, isPop_upSharePostOpen, isPop_upCommentOpen, deletePostPopUp, isLikesPopUpOpen])

    return (
        <div className='sidebar'>

            <div className='both-components'>
                <div>
                    {isWeatherTabOn ? !loader ? alert === "" ?
                        <div className={blur ? 'main-weather-container shadow blur-background' : 'main-weather-container shadow'}>
                            <div className='weather-city-name'>
                                <h3>Weather in {loggedInUser.city}</h3>
                            </div>

                            <div className='close-weather-btn'>
                              <button className='btn' title='Close' onClick={() => {setIsWeatherTabOn(false)}}><Close className='close-icon-weather' /></button>
                            </div>

                            <div className='weather-img-degrees'>
                                <img className='weather-img' src={"http://openweathermap.org/img/wn/" + weatherData?.weather[0].icon + "@2x.png"}></img>
                                <div className='degrees'>
                                  <h1>{weatherData?.main.temp}</h1>
                                  <span> &nbsp; °C</span>
                                </div>  
                            </div>

                            <div className='weather-description'>
                                <h4>{weatherData?.weather[0].description.toUpperCase()}</h4>
                            </div>

                            <hr className='weather-hr'></hr>

                            <div className='weather-details text-align'>
                                <h4>Feels like: <span className='weather-details-span'>{weatherData?.main.feels_like}°C</span></h4>
                                <h4>Wind speed: <span className='weather-details-span'>{weatherData?.wind.speed} m/s</span></h4>
                            </div>

                            <hr className='weather-hr'></hr>

                            <div className='weather-details text-align'>
                                <h4>Pressure: <span className='weather-details-span'>{weatherData?.main.pressure} hPa</span></h4>
                                <h4>Humidity: <span className='weather-details-span'>{weatherData?.main.humidity} %</span></h4>
                            </div>

                            <hr className='weather-hr'></hr>

                            <div className='weather-details text-align'>
                                <h4>Sunrise: <span className='weather-details-span'>
                                    {new Date(weatherData?.sys.sunrise*1000).getHours()}:
                                    {new Date(weatherData?.sys.sunrise*1000).getMinutes()}:
                                    {new Date(weatherData?.sys.sunrise*1000).getSeconds()}
                                    </span>
                                </h4>
                                <h4>Sunset: <span className='weather-details-span'>
                                    {new Date(weatherData?.sys.sunset*1000).getHours()}:
                                    {new Date(weatherData?.sys.sunset*1000).getMinutes()}:
                                    {new Date(weatherData?.sys.sunset*1000).getSeconds()}
                                    </span>
                                </h4>
                            </div>

                        </div>

                        :

                        <div className={blur ? 'show-weather-section shadow blur-background' : 'show-weather-section shadow'}>
                            <h2>Weather Forecast</h2>

                            <div className='alert'>{alert}</div>

                            <Link className='settings-btn-weather' to={'/settings/basic-info'}>
                                <span className='btn settings-btn-weather-inside'>
                                    <Settings />
                                    Go to settings
                                </span>
                            </Link>
                        </div>

                        :

                        <div className={blur ? 'main-weather-container shadow blur-background' : 'main-weather-container shadow'}>
                            <div className='weather-loader-container'>
                                <CircularProgress size="40px" className="feed-loader" />
                            </div> 
                        </div>

                        :

                        <div className={blur ? 'show-weather-section shadow blur-background' : 'show-weather-section shadow'}>
                            <h2>Weather Forecast</h2>

                            <button className='btn advanced-btn link' onClick={weatherHandler}>Show Weather</button>
                        </div>
                    }
                </div>

                {!isWeatherTabOn &&
                    <div className={blur ? `ads-container blur-background ${isVisible ? 'visible' : ''}` : `ads-container ${isVisible ? 'visible' : ''}`}>
                        <img src="/assets/person/ads.jpg" alt="ads" />
                    </div>
                }
            </div>
            
        </div>

    )

}

export default Sidebar;