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

const loadFeaturedPlaylist = async() => {
  // get items from playlist 
  const {playlists: {items}} = await fetchRequest(ENPOINT.featuredPlaylist);
  const playlistItemsSection = document.querySelector("#featured-playlist-items");

  // get destructure name image id 
  for(let {name, description, images, id} of items){
    // create playlistItem section and add classes and id
    const playlistItem = document.createElement("section");
    playlistItem.classList = "rounded p-4 border-solid border-2 hover:cursor-pointer";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    // onclick run onPlaylistItemClicked 
    playlistItem.addEventListener("click", onPlaylistItemClicked);
    // get image from url 
    const [{url: imageUrl}] = images;
    // add img, name, description in playlistItem section innerHTML
     playlistItem.innerHTML = `<img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow" />
    <h2 class="text-sm">${name}</h2>
    <h3 class="text-xs">${description}</h3>`;
    // append playlistItem in playlistItemsSection section 
    playlistItemsSection.appendChild(playlistItem);
  }


}


document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadFeaturedPlaylist();
    // on clicking upon anywhere on the page, hide logout option 
   document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if(!profileMenu.classList.contains("hidden")){
        profileMenu.classList.add("hidden");
    }

   })
})