import { fetchRequest } from "../api";
import { ENPOINT, logout, SECTIONTYPE } from "../common";

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

// run upon clicking on the playlist item 
// invoke loadSection funciton 
const onPlaylistItemClicked = (event, id) => {
console.log(event.target);
const section = {type: SECTIONTYPE.PLAYLIST, playlist: id}
history.pushState(section,"",`playlist/${id}`);
loadSection(section);
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
    playlistItem.className =  "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    // onclick run onPlaylistItemClicked 
    playlistItem.addEventListener("click", (event) => onPlaylistItemClicked(event, id));
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

const formatTime = (duration) => {
  const min = Math.floor(duration/60_000);
  const sec = ((duration % 6_000) / 1000).toFixed(0);
  const formattedTime = sec == 60?
  min + 1 + ":00": min + ":" + (sec < 10? "0":"")+ sec;
  return formattedTime;
}

const loadPlaylistTracks = ({tracks})=> {
  const trackSection = document.querySelector("#tracks");
let trackNo = 1;
  for(let trackItem of tracks.items) {
    let {id, artists, name, album, duration_ms: duration} = trackItem.track;
    let track = document.createElement("section");
    track.id = id;
    track.className = "track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black";
    let image = album.images.find(img => img.height === 64);
    track.innerHTML = ` 
   <p class="justify-self-center">${trackNo++}</p>
   <section class="grid grid-flow-cols-[auto_1fr] place-items-center">
   <img class="h8 w-8" src="${image.url}" alt="${name}" />
   <article class="flex flex-col">
   <h2 class="text-xl text-primary">${name}</h2>
   <p class="text-sm">${Array.from(artists, artist => artist.name).join(", ")}</p>
   </article>
   </section>
   <p>${album.name}</p>
   <p>${formatTime(duration)}</p>
`;
trackSection.appendChild(track);
  }

}

 const fillContentForPlaylist = async (playlistId) => {
   const playlist = await fetchRequest(`${ENPOINT.playlist}/${playlistId}`)
   const pageContent = document.querySelector("#page-content");
   pageContent.innerHTML = `
   <header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-10">
           <nav class="py-2">
             <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary">
               <li class="justify-self-center">#</li>
               <li>Title</li>
               <li>Album</li>
               <li>🕚</li>
             </ul>
           </nav>
   </header>
   <section class="px-8 text-secondary mt-4" id="tracks">
   </section>
   `

loadPlaylistTracks(playlist)



  }

  let onContentScroll;

// if its on DASHBOARD shows the playlists 
// else load page content 
const loadSection = (section) => {
  if(section.type === SECTIONTYPE.DASHBOARD){
    fillContentForDashboard();
    loadPlaylist();
  } else if(section.type === SECTIONTYPE.PLAYLIST){
   fillContentForPlaylist(section.playlist);
  }
  document.querySelector(".content").removeEventListener("scroll", onContentScroll)
  document.querySelector(".content").addEventListener("scroll", onContentScroll)
}


document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    const section = {type: SECTIONTYPE.DASHBOARD};
    history.pushState(section,"","");
    loadSection(section)
    fillContentForDashboard();
    loadPlaylists();
    // on clicking upon anywhere on the page, hide logout option 
   document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if(!profileMenu.classList.contains("hidden")){
        profileMenu.classList.add("hidden");
    }

   })


 
   //on scroll makes header sticky
   document.querySelector(".content").addEventListener("scroll", (event) => {
    const{scrollTop} = event.target;
    const header = document.querySelector(".header");
    if(scrollTop >= header.offsetHeight) {
      header.classList.add("sticky", "top-0", "bg-black-secondary");
      header.classList.remove("bg-transparent")
    } else {
      header.classList.remove("sticky", "top-0", "bg-black-secondary");
      header.classList.add("bg-transparent")
    }
    if(history.state.type === SECTIONTYPE.PLAYLIST){

      const playlistHeader = document.querySelector("#playlist-header");
      if(scrollTop >= playlistHeader.offsetHeight){
        playlistHeader.classList.add("sticky", "top-[${header.offsetHeight}px]")
      }
    }
   })
   
  //  upon clicking on backbutton, takes back to the DASHBOARD with playlists 
   window.addEventListener("popstate",(event) => {
    loadSection(event.state);
   })
})