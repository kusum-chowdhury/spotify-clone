import { fetchRequest } from "../api";
import { ENPOINT, logout } from "../common";

// toggles the hidden logout option upon clicking on profile button 
const onProfileClick = (event) => {
    event.stopPropagation();
  const profileMenu = document.querySelector("#profile-menu");
  profileMenu.classList.toggle("hidden");
//   if profile menu isnt hidden 
// upon clicking on logout button runs logout function
  if(!profileMenu.classList.contains("hidden")){
    profileMenu.querySelector("li#logout").addEventListener("click", logout)
  }
}


// loads user profile
 const loadUserProfile = async() => {
  const defaultImage = document.querySelector("#default-image");
  const profileButton = document.querySelector("#user-profile-btn");
  const displayNameElement = document.querySelector("#display-name"); 

//   fetches username and image
 const {display_name: displayName, images} = await fetchRequest(ENPOINT.userInfo);

//  if image is available shows it 
 if(images?.length){
    defaultImage.classList.add("hidden");
 }else {
    defaultImage.classList.remove("hidden");
 }

 displayNameElement.textContent = displayName;
// click on the profile button runs onprofileclick function
 profileButton.addEventListener("click", onProfileClick);

}

const onPlaylistItemClicked = (event) => {
console.log(event.target);
}

//takes arguememnts
const loadPlaylist = async(endpoint, elementId) => {
  // get items from playlist 
  const {playlists: {items}} = await fetchRequest(endpoint);
  const playlistItemsSection = document.querySelector(`#${elementId}`);

  // get destructure name image id 
  for(let {name, description, images, id} of items){
    // create playlistItem section and add classes and id
    const playlistItem = document.createElement("section");
    playlistItem.className = "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    // onclick run onPlaylistItemClicked 
    playlistItem.addEventListener("click", onPlaylistItemClicked);
    // get image from url 
    const [{url: imageUrl}] = images;
    // add img, name, description in playlistItem section innerHTML
     playlistItem.innerHTML = `<img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow" />
    <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
    <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`;
    // append playlistItem in playlistItemsSection section 
    playlistItemsSection.appendChild(playlistItem);
  }


}
// select article for playlist section 
// create map with type and id 
// add article with playlist in pageContent 
const fillContentForDashboard = () => {
  const pageContent = document.querySelector("#page-content")
  const playlistMap = new Map([["featured", "featured-playlist-items"], ["top playlists", "top-playlist-items"]])
 let innerHTML = "";
 for(let [type, id] of playlistMap){
  innerHTML += `<article class="p-4">
  <h1 class="text-2xl mb-4 font-bold capitalize">${type}</h1>
  <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4" >
    
  </section>
</article>`
 }
 pageContent.innerHTML = innerHTML;
}

// run loadPlaylist and provide arguements 
const loadPlaylists = () => {
   loadPlaylist(ENPOINT.featuredPlaylist, "featured-playlist-items");
   loadPlaylist(ENPOINT.toplists, "top-playlist-items");
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    fillContentForDashboard();
    loadPlaylists();
    // on clicking upon anywhere on the page, hide logout option 
   document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if(!profileMenu.classList.contains("hidden")){
        profileMenu.classList.add("hidden");
    }

   })
})