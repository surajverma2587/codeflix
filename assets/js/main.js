const onLoad = () => {
  const functionForJSON = (responseObject) => {
    // unless you have some logic here do that before you return
    return responseObject.json();
  };

  const functionForApplication = (dataFromServer) => {
    const topMovies = dataFromServer.Search;
    console.log(topMovies);
  };

  const functionToHandleError = (errorObject) => {
    // handle your error here according to your application
  };

  fetch("http://www.omdbapi.com/?s=avengers&apikey=ba22d6b7")
    .then(functionForJSON)
    .then(functionForApplication)
    .catch(functionToHandleError);
};

$(document).ready(onLoad);
