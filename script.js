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
  {
    id: 2,
    title: "Shimmy Shimmy Ya",
    artist: "ODB",
    duration: "03:48",
    url: "assets/songs/ODB-Shimmy Shimmy Ya.mp3",
  },
 
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

// Highlight current song
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  // Remove highlight from all songs
  playlistSongElements.forEach((songEl) => {
    songEl.classList.remove("highlighted");
  });

  // Highlight current song
  if (songToHighlight) songToHighlight.classList.add("highlighted");
};


/**
 * Update the progress bar based on the current time of the audio.
 */
const updateProgressBar = () => {
  // Get the progress bar element
  const progressBar = document.getElementById('progress-bar');

  // Calculate the width of the progress bar based on the current time and total duration
  const progressWidth = (audio.currentTime / audio.duration) * 100;

  // Set the width of the progress bar
  progressBar.style.width = `${progressWidth}%`;
};

// Add an event listener to update the progress bar when the audio's time updates
audio.addEventListener('timeupdate', updateProgressBar);

/**
 * Update the current time of the audio based on the user's click on the progress bar.
 */
progressBarContainer.addEventListener('click', (e) => {
  // Get the width of the progress bar container
  const progressBarWidth = progressBarContainer.clientWidth;

  // Get the x-coordinate of the user's click relative to the container
  const clickX = e.offsetX;

  // Calculate the new current time based on the click position and the total duration
  const newCurrentTime = (clickX / progressBarWidth) * audio.duration;

  // Set the current time of the audio
  audio.currentTime = newCurrentTime;
});

document.getElementById('volume-control').addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Play song function
/**
 * Plays a song based on its ID.
 * @param {string} id - The ID of the song to play.
 */
const playSong = (id) => {
  // Find the song object in the userData.songs array that matches the given ID.
  const song = userData?.songs.find((song) => song.id === id);

  // Set the audio source and title to the song's URL and title respectively.
  audio.src = song.url;
  audio.title = song.title;

  // If the current song is not the same as the song to be played, reset the audio's current time to 0.
  // If the current song is the same as the song to be played, set the audio's current time to the userData.songCurrentTime.
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }

  // Update the userData.currentSong to the song to be played.
  userData.currentSong = song;

  // Add the 'playing' class to the playButton.
  playButton.classList.add("playing");

  // Highlight the current song.
  highlightCurrentSong();

  // Set the player display.
  setPlayerDisplay();

  // Set the play button accessible text.
  setPlayButtonAccessibleText();

  // Play the audio.
  audio.play();
};

// Pause song
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  
  playButton.classList.remove("playing");
  audio.pause();
};


/**
 * Play next song
 * If there is no current song, play the first song
 * Otherwise, find the index of the current song in the userData.songs array
 * and play the song at the next index.
 */
const playNextSong = () => {
  // Check if there is no current song
  if (userData?.currentSong === null) {
    // Play the first song
    playSong(userData?.songs[0].id); // (1)
  } else {
    // Find the index of the current song
    const currentSongIndex = getCurrentSongIndex(); // (2)
    // Get the song at the next index
    const nextSong = userData?.songs[currentSongIndex + 1]; // (3)

    // Play the next song
    playSong(nextSong.id); // (4)
  }
};


/**
 * Play previous song
 * If there is no current song, do nothing
 * Otherwise, find the index of the current song in the userData.songs array
 * and play the song at the previous index.
 */
const playPreviousSong = () =>{
   // Check if there is no current song
   if (userData?.currentSong === null) {
     // Do nothing
     return;
   } else {
     // Find the index of the current song
     const currentSongIndex = getCurrentSongIndex(); // (2)
     // Get the song at the previous index
     const previousSong = userData?.songs[currentSongIndex - 1]; // (3)

     // Play the previous song
     playSong(previousSong.id); // (4)
   }
};

// Shuffle
const shuffle = () => {
  // Randomize the order of the songs
  // Sort the songs array in a random order
  userData?.songs.sort(() => Math.random() - 0.5);
  
  // Set the current song to null
  // Reset the current time to 0
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  // Render the shuffled songs
  renderSongs(userData?.songs);

  // Pause the song
  pauseSong();

  // Set the player display
  setPlayerDisplay();
  
  // Set the play button accessible text
  setPlayButtonAccessibleText();
};

// Delete song
/**
 * Deletes a song from the playlist and updates the display.
 * @param {string} id - The ID of the song to delete.
 */
const deleteSong = (id) => {
  // Remove song from playlist
  // If the song to be deleted is the current song,
  // set the current song to null and reset the current time to 0
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null; // (1)
    userData.songCurrentTime = 0; // (2)

    pauseSong(); // (3)
    setPlayerDisplay(); // (4)
  }
  

  // Remove song from array
  // Filter out the song with the given id
  userData.songs = userData?.songs.filter((song) => song.id !== id); // (1)
  
  // Re-render the songs
  renderSongs(userData?.songs); // (2)
  
  // Highlight the current song
  highlightCurrentSong(); // (3)
  
  // Set the play button accessible text
  setPlayButtonAccessibleText(); // (4)


  // Reset playlist button
  if (userData?.songs.length === 0) { // Check if playlist is empty
    const resetButton = document.createElement("button"); // Create reset button
    const resetText = document.createTextNode("Reset Playlist"); // Create reset button text

    // Set button attributes
    resetButton.id = "reset"; // Set button id
    resetButton.ariaLabel = "Reset playlist"; // Set button aria label
    resetButton.appendChild(resetText); // Append button text
    playlistSongs.appendChild(resetButton); // Append button to playlist

    // Add event listener to reset button
    resetButton.addEventListener("click", () => { // Add click event listener
      userData.songs = [...allSongs]; // Reset playlist
    
      // Render songs
      renderSongs(sortSongs()); // Sort songs
      setPlayButtonAccessibleText(); // Set play button accessible text
      resetButton.remove(); // Remove reset button
    });
  }
};

// Set player display
const setPlayerDisplay = () => {
  // Get the elements to display the song title and artist
  const playingSong = document.getElementById("player-song-title"); // (1)
  const songArtist = document.getElementById("player-song-artist"); // (2)

  // Get the current song's title and artist
  const currentTitle = userData?.currentSong?.title; // (3)
  const currentArtist = userData?.currentSong?.artist; // (4)

  // Set the text content of the elements
  playingSong.textContent = currentTitle ? currentTitle : "Song Title"; // (5)
  songArtist.textContent = currentArtist ? currentArtist : "Artist Name"; // (6)
};



// Render songs
const renderSongs = (array) => {
  // Sort songs
  const songsHTML = array
    .map((song)=> { // (1)
      // Create song element
      return `
      <!-- Song element -->
      <li id="song-${song.id}" class="playlist-song">
        <div class="playlist-song-info" onclick="playSong(${song.id})"> <!-- Song info click event -->
          <span class="playlist-song-title">${song.title}</span> <!-- Song title -->
          <span class="playlist-song-artist">${song.artist}</span> <!-- Song artist -->
          <span class="playlist-song-duration">${song.duration}</span> <!-- Song duration -->
        </div>
        <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}"> <!-- Delete button click event -->
          &#x2716; <!-- Using a simple cross mark for delete -->
        </button>
      </li>
      `;
    })
    .join(""); // Join the array into a string

  playlistSongs.innerHTML = songsHTML; // Set the innerHTML of playlistSongs to songsHTML
};


// Set play button accessible text
const setPlayButtonAccessibleText = () => {
  // Get the current song from userData, or use the first song if currentSong is null
  const song = userData?.currentSong || userData?.songs[0];

  // Set the aria-label attribute of the play button to either "Play {song.title}" or just "Play"
  // This allows screen readers to announce the song title when the button is focused
  playButton.setAttribute(
    "aria-label", // Set the aria-label attribute
    song?.title ? `Play ${song.title}` : "Play" // Set the aria-label text
  );
};

/**
 * Get the index of the current song in the userData.songs array
 * @returns {number} The index of the current song, or -1 if currentSong is null
 */
const getCurrentSongIndex = () => { // (1)
  return userData?.songs.indexOf(userData?.currentSong); // (2)
};


// Event listeners

// Play button click event
playButton.addEventListener("click", () => { // (1)
  if (userData?.currentSong === null) { // (2)
    // Play first song
    playSong(userData?.songs[0].id); // (3)
  } else {
    playSong(userData?.currentSong.id); // (4)
  }
});


// Pause button click event
pauseButton.addEventListener("click", pauseSong); // Pause the song

// Next button click event
nextButton.addEventListener("click", playNextSong); // Play the next song

// Previous button click event
previousButton.addEventListener("click", playPreviousSong); // Play the previous song

// Shuffle button click event
shuffleButton.addEventListener("click", shuffle); // Shuffle the playlist


// Play next song when audio ends
audio.addEventListener("ended", () => {
  // Get the index of the current song
  const currentSongIndex = getCurrentSongIndex(); // (1)

  // Check if there is a next song
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined; // (2)

  if (nextSongExists) { // (3)
    // Play the next song
    playNextSong(); // (4)
  } else { // (5)
    // Reset the current song and current time
    userData.currentSong = null; // (1)
    userData.songCurrentTime = 0; // (2)

    // Pause the song
    pauseSong(); // (3)

    // Update the player display
    setPlayerDisplay(); // (4)

    // Highlight the current song
    highlightCurrentSong(); // (5)

    // Update the play button accessible text
    setPlayButtonAccessibleText(); // (6)
  }
});

/**
 * Sorts the songs array by title in ascending order.
 * 
 * @returns {Array} The sorted songs array.
 */
const sortSongs = () => {
  // Sort the songs array in ascending order by title
  userData?.songs.sort((a, b) => {
    // If the title of song a is less than the title of song b, return -1
    if (a.title < b.title) {
      return -1;
    }

    // If the title of song a is greater than the title of song b, return 1
    if (a.title > b.title) {
      return 1;
    }

    // If the titles are the same, return 0
    return 0;
  });

  // Return the sorted songs array
  return userData?.songs;
};


// Render songs
// Call sortSongs to sort the songs array before rendering it
renderSongs(sortSongs());

// Set the accessible text of the play button
setPlayButtonAccessibleText();

// Event listener for window load (loading animation)
document.addEventListener('DOMContentLoaded', () => {
  // Get the loading overlay and content elements
  const loadingOverlay = document.getElementById('loading-overlay');
  const content = document.getElementById('content');

  // Simulate loading for 2 seconds
  setTimeout(() => {
      // Hide the loading overlay
      loadingOverlay.style.display = 'none';

      // Remove the 'blurred' class from the content
      content.classList.remove('blurred');
  }, 2000); // 2 seconds
});


