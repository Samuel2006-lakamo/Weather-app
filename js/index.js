"use strict";



const searchBtn = document.getElementById("search-btn");
console.log("hello world");
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

        return data;
    } catch (err) {
        console.error("Error:", err);
    } finally {
        loader.style.display = "none";
    }
}

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
        Feels like ${data.main.feels_like.toFixed(0)}°C. ${
            data.weather[0].main
        }, ${data.weather[0].description}
      </p>
      <div class="weather-data">
        <div>
          <img src="${iconUrl}" class="weather-icon">
        </div>
        <p>${data.main.temp.toFixed(0)}°C</p>
      </div>
      <hr />
      <div>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Visibility: ${(data.visibility / 1000).toFixed(1)} km</p>
      </div>
    </div>
                        <div class="main-right">
      <div id="map" ></div>
    </div>
  </div>`;
    document.querySelector(".container").innerHTML = html;
    showMap(data.coord.lat, data.coord.lon, data.name);
}

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) {
        console.log("pls enter city name");
        return;
    }
    document.querySelector(".container").innerHTML = `<div class="loader">
    </div>`;
    const getWeatherData = await weatherData(city);
    renderHtml(getWeatherData);
});
cityInput.addEventListener("keypress", async e => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (!city) {
            alert("Please enter a city name");
            return;
        }
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
