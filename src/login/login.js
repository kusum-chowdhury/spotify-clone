const CLIENT_ID = "3b1d5406f26c4a509611a031507ab5a8";
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";
const ACCESS_TOKEN_KEY = "accessToken";
const APP_URL = "http://localhost:3000";

const REDIRECT_URI = "http://localhost:3000/login/login.html"
//authorization id to to access scopes and redirect url
//go to the login window
const authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`;
    window.open(url, "login", "window=800, height=600");

}

// saving information associated with the app inside local storage
window.setItmesInLocalStorage = ({accessToken, tokenType, expiresIn}) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("tokenType", tokenType);
    localStorage.setItem("expiresIn", expiresIn);
    window.location.href = APP_URL;
}
 

//looks for access token
// if true go to dashboard
window.addEventListener("load", () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
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
