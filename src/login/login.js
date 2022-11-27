import {ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE} from "../common"


const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

const APP_URL = import.meta.env.VITE_APP_URL;
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";

const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
//authorization id to to access scopes and redirect url
//go to the login window
const authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`;
    window.open(url, "login", "window=800, height=600");

}

// saving information associated with the app inside local storage
window.setItmesInLocalStorage = ({accessToken, tokenType, expiresIn}) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_TYPE, tokenType);
    localStorage.setItem(EXPIRES_IN, expiresIn);
    window.location.href = APP_URL;
}
 

//looks for access token
// if true go to dashboard
window.addEventListener("load", () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    if(accessToken) {
        window.location.href = `${APP_URL}/dashboard/dashboard.html`
    }
    // if opener isn't closed focus on window
    if(window.opener !== null && !window.opener.closed){
        window.focus();
        // if window closed by user 
        // closes the window 
        if(window.location.href.includes("error")){
            window.close();
        }

        // getting info from the hash 
        const {hash} = window.location;
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");
        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");

        // if accessToken closes the popup
        // run  setItmesInLocalStorage 
        if(accessToken) {
            window.close();
            window.opener.setItmesInLocalStorage( { accessToken, tokenType, expiresIn } );

         } else {
        window.close();
      }
    }
})

document.addEventListener("DOMContentLoaded", () => {
   
    const loginButton = document.getElementById("login-to-spotify");
    //onclick run authorizeUser function
    loginButton.addEventListener("click", authorizeUser)


})
