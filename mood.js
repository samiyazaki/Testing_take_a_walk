// SPOTIFY API::

const APIController = (function () {
    const clientId = "ead6fd1d003e499dad7f6403e4c7a14b";
    const clientSecret = "d680859a5f9e4353a3c87409a58dacc7";
  
    // private methods
    const _getToken = async () => {
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      });
  
      const data = await result.json();
      return data.access_token;
    };
  
    const _getGenres = async (token) => {
      const limit = 50;
  
      const result = await fetch(
        `https://api.spotify.com/v1/browse/categories?locale=en_US&limit=${limit}`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
  
      const data = await result.json();
      return data.categories.items;
    };
  
    const _getPlaylistByGenre = async (token, genreId) => {
      const limit = 50;
  
      const result = await fetch(
        `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );
  
      const data = await result.json();
      return data.playlists.items;
    };
  
    return {
      getToken() {
        return _getToken();
      },
      getGenres(token) {
        return _getGenres(token);
      },
      getPlaylistByGenre(token, genreId) {
        return _getPlaylistByGenre(token, genreId);
      },
      getTracks(token, tracksEndPoint) {
        return _getTracks(token, tracksEndPoint);
      },
    };
  })();
  
  // UI Module
  const UIController = (function () {
    //object to hold references to html selectors
    const DOMElements = {
      selectGenre: "#select_genre",
      selectPlaylist: "#select_playlist",
      buttonSubmit: "#btn_submit",
      divSongDetail: "#song-detail",
      hfToken: "#hidden_token",
    };
  
    //public methods
    return {
      //method to get input fields
      inputField() {
        return {
          genre: document.querySelector(DOMElements.selectGenre),
          playlist: document.querySelector(DOMElements.selectPlaylist),
          submit: document.querySelector(DOMElements.buttonSubmit),
        };
      },
  
      // need methods to create select list option
      createGenre(text, value) {
        const html = `<option value="${value}">${text}</option>`;
        document
          .querySelector(DOMElements.selectGenre)
          .insertAdjacentHTML("beforeend", html);
      },
  
      createPlaylist(text, value) {
        const html = `<option value="${value}">${text}</option>`;
        document
          .querySelector(DOMElements.selectPlaylist)
          .insertAdjacentHTML("beforeend", html);
      },
  
      storeToken(value) {
        document.querySelector(DOMElements.hfToken).value = value;
      },
  
      getStoredToken() {
        return {
          token: document.querySelector(DOMElements.hfToken).value,
        };
      },
    };
  })();
  
  const APPController = (function (UICtrl, APICtrl) {
    // get input field object ref
    const DOMInputs = UICtrl.inputField();
  
    // get genres on page load
    const loadGenres = async () => {
      //get the token
      const token = await APICtrl.getToken();
      //store the token onto the page
      UICtrl.storeToken(token);
      //get the genres
      const genres = await APICtrl.getGenres(token);
      //populate our genres select element
      genres.forEach((element) => UICtrl.createGenre(element.name, element.id));
    };
  
    // create genre change event listener
    DOMInputs.genre.addEventListener("change", async () => {
      //get token that's stored on the page
      const token = UICtrl.getStoredToken().token;
      // get genre select field
      const genreSelect = UICtrl.inputField().genre;
      // get  genre id associated with the selected genre
      const genreId = genreSelect.options[genreSelect.selectedIndex].value;
      // get  playlist based on a genre
      const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
      // create a playlist list item for every playlist returned
      playlist.forEach((p) => UICtrl.createPlaylist(p.name, p.href));
    });
  
    // create submit button click event listener
    DOMInputs.submit.addEventListener("click", async (e) => {
      // prevent page reset
      e.preventDefault();
      //get the token
      const token = UICtrl.getStoredToken().token;
      // get the playlist field
      const playlistSelect = UICtrl.inputField().playlist;
      // get playlist url
      const tracksEndPoint =
        playlistSelect.options[playlistSelect.selectedIndex].value;
  
      // console log the playlist url
      console.log(tracksEndPoint);
  
      // create selected playilst_id object for iframe src url
      const iframeId = tracksEndPoint.replace(
        "https://api.spotify.com/v1/playlists/",
        ""
      );
  
      // create new iframe src attribute
      var iframePlayer = document.getElementById("iframe-player");
  
      // set src in iframe to selected playlist
      iframePlayer.setAttribute(
        "src",
        "https://open.spotify.com/embed/playlist/" +
          iframeId +
          "?utm_source=generator"
      );
  //Saving the user selction by select_playlist to localStorage
  const userSelection = document.getElementById("select_playlist").textContent;
  
  localStorage.setItem("selectedPlaylist", userSelection);
  
  const selectedPlaylist = playlistSelect.options[playlistSelect.selectedIndex].text;
  //Creating a button for the user to recall the selected playlist
  const button = document.createElement("button");
  button.innerText = selectedPlaylist;
  
  
  
  
  
  
  
  
  
  
  
  // 
  button.classList.add("btn", "btn-success");
  //can't figure out how to make the name of the playlist appear instead of it's link id
  document.getElementById("past-choice").appendChild(button);
  // Trying to JSON.stringify the past selections so they can be stored. It's not working properly
  const pastSelections = ["playlist1", "playlist2", "playlist3"];
  const pastSelectionsAsString = JSON.stringify(pastSelections);
  localStorage.setItem("pastSelections", pastSelectionsAsString);
  
  
  
 
  
      //
      //
      //
      //
      //Local Storage Past Playlist Buttons:::
      //
      //
      // creating button for previous selections
      const btn = document.createElement("BUTTON");
  
      // get the playlist title
      btn.innerHTML = playlistSelect;
  
      var pastChoice = document.getElementById("past-choice");
  
      pastChoice.appendChild(btn);
  
      btn.setAttribute(
        "class",
        "container waves-effect waves-light hoverable btn-secondary"
      );
    });
  
  //   localStorage.setItem("moodMusicPreference", userSelection);
  //   console.log("userSelection");
  
  // const userSelection = localStorage.getItem("moodMusicPreference");
  //     document.getElementById("select_genre").value = userSelection;
  //  console.log("userSelection");
   
  
    // declaring selected playlist url globally
    // const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
  
    // double checking it works
    // console.log(tracksEndPoint);
  
    return {
      init() {
        console.log("App is starting");
        loadGenres();
      },
    };
  })(UIController, APIController);
  
  //call a method to load the genres on page load
  APPController.init();