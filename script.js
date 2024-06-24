// Global Variables
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const progressBarContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

// all songs array
const allSongs = [
  {
    id: 0,
    title: "1901",
    artist: "Phoenix",
    duration: "02:43",
    url: "assets/songs/Phoenix-1901.mp3",
  },
  {
    id: 1,
    title: "Rhinestone Eyes",
    artist: "Gorillaz",
    duration: "03:20",
    url: "assets/songs/Gorillaz-Rhinestone Eyes.mp3",
  },

 
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const updateProgressBar = () => {
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
};

audio.addEventListener('timeupdate', updateProgressBar);

progressBarContainer.addEventListener('click', (e) => {
  const width = progressBarContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});


document.getElementById('volume-control').addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Play song
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.url;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

// Pause song
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  
  playButton.classList.remove("playing");
  audio.pause();
};

// Play next song
const playNextSong = () => {
  // If there is no current song, play the first song
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

// Play previous song
const playPreviousSong = () =>{
   if (userData?.currentSong === null) return;
   else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

// Shuffle
const shuffle = () => {
  // Randomize the order of the songs
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  // Render songs
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

// Delete song
const deleteSong = (id) => {
  // Remove song from playlist
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }
  
  // Remove song from array
  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

  // Reset playlist button
  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    // Reset playlist
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    // Add event listener to reset button
    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];
    
      // Render songs
      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

  }

};

// Set player display
const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  // Set player display
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

// Highlight current song
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  // Remove highlight from all songs
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  // Highlight current song
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

// Render songs
const renderSongs = (array) => {
  // Sort songs
  const songsHTML = array
    .map((song)=> {
      // Create song element
      return `
      <li id="song-${song.id}" class="playlist-song">
        <div class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
        </div>
        <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          &#x2716; <!-- Using a simple cross mark for delete -->
        </button>
      </li>
      `;
    })
    .join(""); // Join the array into a string

  playlistSongs.innerHTML = songsHTML;
};

// Set play button accessible text
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  // Set play button accessible text
  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

// Get current song index
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

// Event listeners
playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
      // Play first song
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

// Play next song when audio ends
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;  
pauseSong();
setPlayerDisplay();
highlightCurrentSong();
setPlayButtonAccessibleText();

    }
});

// Sort songs
const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};
// Render songs
renderSongs(sortSongs());
setPlayButtonAccessibleText();