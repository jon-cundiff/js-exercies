const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieList = document.getElementById("movieList");
const movieDetails = document.getElementById("movieDetails");
const errorAlert = document.getElementById("errorAlert");

const baseurl = "http://www.omdbapi.com";
const apiKey = "5fe80d12";

function executeXMLGetRequest(url, callback) {
    // callback expects (data, error)
    const request = new XMLHttpRequest();
    request.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            if (data.Response === "True") {
                return callback(data, null);
            } else {
                return callback(null, data.Error);
            }
        }

        callback(null, "There was an error in the request.");
    };

    request.open("GET", url);
    request.send();
}

function getSearchResults(searchTerm, callback) {
    executeXMLGetRequest(
        `${baseurl}/?apikey=${apiKey}${searchTerm ? "&s=" + searchTerm : ""}`,
        (data, err) => {
            if (err) {
                displayError(err);
            } else {
                callback(data.Search);
            }
        }
    );
}

function getMovieDetails(event, movieId, callback) {
    event.preventDefault();
    executeXMLGetRequest(
        `${baseurl}/?i=${movieId}&apikey=${apiKey}`,
        (data, err) => {
            if (err) {
                displayError("There was an error retrieving movie details.");
            } else {
                callback(data);
            }
        }
    );
}

function clearAll() {
    movieDetails.classList.remove("active");
    movieDetails.innerHTML = "";
    movieList.innerHTML = "";
    errorAlert.classList.remove("error-active");
    errorAlert.innerHTML = "";
}

function displayError(errText) {
    errorAlert.innerHTML = errText;
    errorAlert.classList.add("error-active");
}

function displaySearchResults(results) {
    const movieItems = results.map(
        (item) => `
        <a class="movie-item"
            href="#"
            onclick="getMovieDetails(
                event,
                '${item.imdbID}',
                (details) => displayMovieDetails(details))"
                >
            <span>${item.Title}</span>
            <img src="${item.Poster}" />
        </a>
    `
    );
    movieList.innerHTML = movieItems.join("");
}

function displayMovieDetails(details) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    movieDetails.innerHTML = `
    <div class="title-poster">
        <h3>${details.Title}</h3>
        <img src="${details.Poster}" />
    </div>
    <div class="detail-text">
        <p><b>Year: ${details.Year}</b></p>
        <p><b>Motion Picture Rating (MPAA): ${details.Rated}</b></p>
        <p><b>Released: ${details.Released}</b></p>
        <p><b>Directed by ${details.Director}</b></p>
        <p><i>${details.Plot}</i></p>
    </div>
    `;

    movieDetails.classList.add("active");
}

searchButton.addEventListener("click", (event) => {
    clearAll();
    if (searchForm.checkValidity()) {
        event.preventDefault();
        getSearchResults(searchInput.value, (searchResults) => {
            displaySearchResults(searchResults);
        });
    }
});
