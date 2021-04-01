const fetchData = (url) => {
  const functionForJSON = (responseObject) => {
    if (responseObject.status !== 200) {
      throw new Error("oops");
    }
    return responseObject.json();
  };

  const functionForApplication = (dataFromServer) => {
    if (dataFromServer.Error) {
    } else {
      const topMovies = dataFromServer.Search;

      const constructMovieCard = (each) => {
        const card = `<div class="card m-4" style="width: 18rem">
          <img
            src="${each.Poster}"
            class="card-img-top"
            alt="${each.Title}"
          />
          <div class="card-body text-center">
            <h4 class="card-title">${each.Title}</h4>
            <p class="card-text text-muted fs-6">${each.Year}</p>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" type="button">More Info</button>
              <button class="btn btn-success" type="button">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>`;

        return card;
      };

      const cards = topMovies.map(constructMovieCard);

      $("#cards-container").append(cards);
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

const onLoad = () => {
  fetchData("http://www.omdbapi.com/?s=avengers&apikey=ba22d6b7");
};

$(document).ready(onLoad);
