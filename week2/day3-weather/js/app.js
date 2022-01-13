const locationForm = document.getElementById("locationForm");
const cityInput = document.getElementById("cityInput");
const citySubmitButton = document.getElementById("citySubmitButton");
const locationSubmitButton = document.getElementById("locationSubmitButton");
const weatherDetailsContainer = document.getElementById(
    "weatherDetailsContainer"
);

const baseURL = "https://api.openweathermap.org/data/2.5/";
const baseImgURL = "https://openweathermap.org/img/wn";
const apiKey = "cd49ce2e5bf2c0cf55132c87c0e371ec";

const getLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

const getWeatherInfo = async (city) => {
    const response = await fetch(
        `${baseURL}/weather?q=${city}&units=imperial&appid=${apiKey}`
    );
    const weather = await response.json();
    return weather;
};

const getWeatherInfoByCoords = async (latitude, longitude) => {
    const response = await fetch(
        `${baseURL}/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
    );
    const weather = await response.json();
    return weather;
};

const handleLocation = async () => {
    toggleButtonsDisabled();
    displayLoading();
    try {
        const location = await getLocation();
        const { latitude, longitude } = location.coords;
        const weatherDetails = await getWeatherInfoByCoords(
            latitude,
            longitude
        );
        displayWeatherDetails(weatherDetails);
    } catch (error) {
        displayError();
    } finally {
        toggleButtonsDisabled();
    }
};

const displayWeatherDetails = (weatherDetails) => {
    const { name, main, weather } = weatherDetails;
    weatherDetailsContainer.className = "weather-active";
    weatherDetailsContainer.innerHTML = `
        <h2>${name}</h2>
        <img src="${baseImgURL}/${weather[0].icon}.png"/>
        <div id="weatherStats">
            <section>
                <h3>Low</h3>
                <p>${main.temp_min}° F</p>
            </section>
            <section>
                <h3>High</h3>
                <p>${main.temp_max}° F</p>
            </section>
            <section>
                <h3>Pressure</h3>
                <p>${main.pressure} hPa</p>
            </section>
        </div>
    `;
};

const displayLoading = () => {
    weatherDetailsContainer.className = "loading";
    weatherDetailsContainer.innerHTML = "Getting weather data...";
};

const displayError = () => {
    weatherDetailsContainer.className = "";
    weatherDetailsContainer.innerHTML =
        "There was an error in getting weather information.";
};

const toggleButtonsDisabled = () => {
    citySubmitButton.disabled = !citySubmitButton.disabled;
    locationSubmitButton.disabled = !locationSubmitButton.disabled;
};

citySubmitButton.addEventListener("click", async (event) => {
    toggleButtonsDisabled();
    if (cityInput.checkValidity()) {
        event.preventDefault();
        displayLoading();
        const city = cityInput.value;
        try {
            const weatherDetails = await getWeatherInfo(city);
            displayWeatherDetails(weatherDetails);
        } catch (err) {
            displayError();
        } finally {
            toggleButtonsDisabled();
        }
    }
});

locationSubmitButton.addEventListener("click", handleLocation);

handleLocation();
