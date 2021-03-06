const constructMovieCard = (movie) =>
  `<div class="card m-4" style="width: 18rem" data-role="movieCard" data-poster="${movie.Poster}" data-title="${movie.Title}" data-imdb-id="${movie.imdbID}" data-year="${movie.Year}">
    <img
      src="${movie.Poster}"
      class="card-img-top"
      alt="${movie.Title}"
    />
    <div class="card-body text-center">
      <h4 class="card-title">${movie.Title}</h4>
      <p class="card-text text-muted fs-6">${movie.Year}</p>
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="button">More Info</button>
        <button class="btn btn-success" type="button">
          Add to Favourites
        </button>
      </div>
    </div>
  </div>`;

const constructFavouriteMovieCard = (movie) =>
  `<div class="card m-4" style="width: 18rem" data-role="movieCard" data-poster="${movie.Poster}" data-title="${movie.Title}" data-imdb-id="${movie.imdbID}" data-year="${movie.Year}">
    <img
      src="${movie.Poster}"
      class="card-img-top"
      alt="${movie.Title}"
    />
    <div class="card-body text-center">
      <h4 class="card-title">${movie.Title}</h4>
      <p class="card-text text-muted fs-6">${movie.Year}</p>
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="button">More Info</button>
        <button class="btn btn-danger" type="button">
          Remove from Favourites
        </button>
      </div>
    </div>
  </div>`;

const renderMovieCards = (movies, isFavourites = false) => {
  if (!movies.length) {
    renderNoMoviesContainer();
  } else {
    let cards;
    if (isFavourites) {
      cards = movies.map(constructFavouriteMovieCard);
    } else {
      cards = movies.map(constructMovieCard);
    }

    $("#cards-container").empty();
    $("#cards-container").append(cards);

    if (isFavourites) {
      $("[data-role='movieCard']").click(onClickRemoveFavourite);
    } else {
      $("[data-role='movieCard']").click(onClickAddFavourite);
    }
  }
};

const renderNoMoviesContainer = () => {
  const noMoviesComponent = `<h3 class="my-4 text-white">No movies found</h3>`;

  $("#cards-container").empty();

  $("#cards-container").append(noMoviesComponent);
};

const fetchData = (url) => {
  const functionForJSON = (responseObject) => {
    if (responseObject.status !== 200) {
      throw new Error("Internal Server Error");
    }
    return responseObject.json();
  };

  const functionForApplication = (dataFromServer) => {
    if (dataFromServer.Error) {
      renderNoMoviesContainer();
    } else {
      renderMovieCards(dataFromServer.Search);
    }
  };

  const functionToHandleError = (errorObject) => {
    window.location.assign("/404.html");
  };

  fetch(url)
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

const initialiseLocalStorage = () => {
  const localStorageData = localStorage.getItem("favouriteMovies");

  if (!localStorageData) {
    localStorage.setItem("favouriteMovies", JSON.stringify([]));
  }
};

const onLoad = () => {
  initialiseLocalStorage();
  fetchData("http://www.omdbapi.com/?s=avengers&apikey=ba22d6b7");
};

const onSubmitBasicSearch = (event) => {
  event.preventDefault();
  const searchTerm = $("#basic-search-input").val();

  if (searchTerm) {
    fetchData(`http://www.omdbapi.com/?s=${searchTerm}&apikey=ba22d6b7`);
  } else {
    console.log("NO Search term");
  }
};

const addToLocalStorage = (data) => {
  const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

  favouriteMovies.push(data);

  localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));
};

const onClickAddFavourite = () => {
  const currentTarget = $(event.currentTarget);
  const dataAttributes = currentTarget.data();

  const newObject = {
    Title: dataAttributes.title,
    Poster: dataAttributes.poster,
    Year: dataAttributes.year,
    imdbID: dataAttributes.imdbId,
  };

  addToLocalStorage(newObject);
};

const onClickRemoveFavourite = () => {
  const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));

  const currentTarget = $(event.currentTarget);
  const dataAttributes = currentTarget.data();

  const callback = (each) => {
    return each.imdbID !== dataAttributes.imdbId;
  };

  const filteredFavouriteMovies = favouriteMovies.filter(callback);

  renderMovieCards(filteredFavouriteMovies, true);

  localStorage.setItem(
    "favouriteMovies",
    JSON.stringify(filteredFavouriteMovies)
  );
};

const onClickFavourites = () => {
  const favouriteMovies = localStorage.getItem("favouriteMovies");

  renderMovieCards(JSON.parse(favouriteMovies), true);
};

$(document).ready(onLoad);

$("#basic-search-form").submit(onSubmitBasicSearch);

$("#favourites").click(onClickFavourites);

$("#home").click(onLoad);
