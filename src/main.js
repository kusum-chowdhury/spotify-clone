import './style.css'


document.addEventListener("DOMContentLoaded", () => {
  // checks if there is accesstoken in local storage
//  takes user to the dashboard
  if(localStorage.getItem('accessToken')){
    window.location.href = 'dashboard/dashboard.html';
    // else take user to the login page 
  } else {
    window.location.href = "login/login.html";
  }
})
