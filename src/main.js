import './style.css';
const APP_URL = import.meta.env.VITE_APP_URL;

document.addEventListener("DOMContentLoaded", () => {
  // checks if there is accesstoken in local storage
//  takes user to the dashboard
  if(localStorage.getItem('accessToken')){
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    // else take user to the login page 
  } else {
    window.location.href = `${APP_URL}/login/login.html`;
  }
})
