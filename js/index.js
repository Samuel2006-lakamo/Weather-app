"use strict";
let celsiusBtn = document.querySelector(".celsius");
let fahrenheitBtn = document.querySelector(".fahrenheit");
let currentUnit = "celsius";
const errorCard = document.querySelector(".error-card");
const dismissBtn = document.querySelector(".dismiss-btn");

// Show error function
function showError(message = "Please check the city name and try again") {
    errorCard.querySelector("p").textContent = message;
    errorCard.classList.remove("hidden");
}

// Hide error function
function hideError() {
    errorCard.classList.add("hidden");
}

// Dismiss button handler
dismissBtn.addEventListener("click", hideError);

const searchBtn = document.getElementById("search-btn");

const cityInput = document.getElementById("city-input");
let map;
async function weatherData(city) {
    let loader = document.querySelector(".loader");
    loader.style.display = "block";
    const API_KEY = "acea87296f26b47e5bec0d8ebc8fba0e";
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (!response.ok) {
            showError("City not found. please enter a valid city");
            return null;
        }
        return data;
    } catch (err) {
        console.error("Error:", err);
        showError("Can't fetch City,Check internet Try again later");
        return null;
    } finally {
        loader.style.display = "none";
    }
}
function updateTemperatures(data) {
    const tempElement = document.querySelector(".weather-data p");
    const feelsLikeElement = document.querySelector(".comment");

    if (currentUnit === "celsius") {
        tempElement.textContent = `${data.main.temp.toFixed(0)}°C`;
        feelsLikeElement.textContent = `Feels like ${data.main.feels_like.toFixed(
            0
        )}°C. ${data.weather[0].main}`;
    } else {
        const fTemp = (data.main.temp * 9) / 5 + 32;
        const fFeelsLike = (data.main.feels_like * 9) / 5 + 32;
        tempElement.textContent = `${fTemp.toFixed(0)}°F`;
        feelsLikeElement.textContent = `Feels like ${fFeelsLike.toFixed(
            0
        )}°F. ${data.weather[0].main}`;
    }
}

// Button event handlers
celsiusBtn.addEventListener("click", async () => {
    if (currentUnit === "celsius") return;

    currentUnit = "celsius";
    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");

    const city = cityInput.value.trim();
    if (city) {
        document.querySelector(".container").innerHTML =
            '<div class="loader"></div>';
        const data = await weatherData(city, "metric");
        renderHtml(data);
    }
});

fahrenheitBtn.addEventListener("click", async () => {
    if (currentUnit === "fahrenheit") return;

    currentUnit = "fahrenheit";
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");

    const city = cityInput.value.trim();
    if (city) {
        document.querySelector(".container").innerHTML =
            '<div class="loader"></div>';
        const data = await weatherData(city, "imperial");
        renderHtml(data);
    }
});

function renderHtml(data) {
    console.log(data);
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    // In the renderHtml function, fix these lines:
    const cityTime = new Date((data.dt + data.timezone) * 1000 - 3600 * 1000);

    const options = {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // AM/PM format (false for 24-hour)
    };

    const dateTimeString = cityTime.toLocaleString("en-US", options);

    const html = `  
  <div class="body">
    <div class="main-left">
      <p class="city-date">${dateTimeString}</p>
      <h3 class="city-name-country">${data.sys.country}, ${data.name}</h3>
      <p class="comment">
        Feels like ${
            currentUnit === "celsius"
                ? data.main.feels_like.toFixed(0)
                : ((data.main.feels_like * 9) / 5 + 32).toFixed(0)
        }${currentUnit === "celsius" ? "°C" : "°F"}. ${data.weather[0].main}, ${
            data.weather[0].description
        }
      </p>
      <div class="weather-data">
        <div>
          <img src="${iconUrl}" class="weather-icon">
        </div>
        <p>${
            currentUnit === "celsius"
                ? data.main.temp.toFixed(0)
                : ((data.main.temp * 9) / 5 + 32).toFixed(0)
        }${currentUnit === "celsius" ? "°C" : "°F"}</p>
      </div>
      <hr />
      <div>
        <p>Humidity: ${data.main.humidity}%</p>
        
<p>Wind Speed: ${
        currentUnit === "celsius"
            ? data.wind.speed + " m/s"
            : (data.wind.speed * 2.237).toFixed(1) + " mph"
    }</p>
        <p>Visibility: ${(data.visibility / 1000).toFixed(1)} km</p>
      </div>
    </div>
                        <div class="main-right">
      <div id="map" ></div>
    </div>
  </div>`;
    document.querySelector(".container").innerHTML = html;
    celsiusBtn.classList.toggle("active", currentUnit === "celsius");
    fahrenheitBtn.classList.toggle("active", currentUnit === "fahrenheit");

    showMap(data.coord.lat, data.coord.lon, data.name);
}

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    document.querySelector(".container").innerHTML = '';
    if (!city) {
        console.log("pls enter city name");
        showError("Please enter a city");
        return null;
    }
    document.querySelector(".container").innerHTML = `<div class="loader">
    </div>`;
    hideError();
    const getWeatherData = await weatherData(city);
    renderHtml(getWeatherData);
});
cityInput.addEventListener("keypress", async e => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (!city) {
            alert("Please enter a city name");
            showError("please enter a city.")
            return null;
        }
        document.querySelector(".container").innerHTML = `<div class="loader">
    </div>`;
    hideError();
        const weatherDataResponse = await weatherData(city);

        renderHtml(weatherDataResponse);
    }
});

function showMap(lat, lon, city) {
    // Remove previous map if it exists
    if (map) {
        map.remove();
    }

    // Initialize new map
    map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Add marker
    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${city}</b>`).openPopup();
}
