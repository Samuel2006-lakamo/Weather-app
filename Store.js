import {
    Map,
    TileLayer,
    Marker,
    Popup
} from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");

// Initialize Map with better default view

function renderMap() {
    const map = L.map("map").setView([20, 0], 2); // World view by default

    // Add OpenStreetMap tiles with better contrast
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Custom icon for the marker
    const customIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    // Add a marker (initially hidden)
    const marker = L.marker([0, 0], {
        icon: customIcon,
        opacity: 0
    }).addTo(map);

    // Fetch Weather Data
    async function fetchWeather(city) {
        const API_KEY = "acea87296f26b47e5bec0d8ebc8fba0e"; // Replace with your key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            console.log(data);

            // Update Map View
            map.setView([data.coord.lat, data.coord.lon], 11); // Zoom to city level

            // Update Marker
            marker
                .setLatLng([data.coord.lat, data.coord.lon])
                .setOpacity(1)
                .bindPopup(
                    `
                  <b>${data.name}</b><br>
                  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" width="40"><br>
                  ${data.main.temp}°C | ${data.weather[0].description}
              `
                )
                .openPopup();

            // Display Weather Info
            weatherInfo.innerHTML = `
            <div class="weather-card">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    <span>${data.weather[0].main}</span>
                </div>
                <p><span>🌡️</span> Temperature: ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)</p>
                <p><span>💧</span> Humidity: ${data.main.humidity}%</p>
                <p><span>🌬️</span> Wind: ${data.wind.speed} m/s</p>
                <p><span>☁️</span> Clouds: ${data.clouds.all}%</p>
                <p><span>📊</span> Pressure: ${data.main.pressure} hPa</p>
            </div>
        `;
        } catch (error) {
            weatherInfo.innerHTML = `<div class="weather-card error">⚠️ ${error.message}</div>`;
            marker.setOpacity(0);
        }
    }
    fetchWeather("london");

    // Event Listeners
    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
        renderMap();
    });

    cityInput.addEventListener("keypress", e => {
        if (e.key === "Enter" && cityInput.value.trim()) {
            fetchWeather(cityInput.value.trim());
        }
    });

    // Optional: Add click event on the map
    map.on("click", function (e) {
        // You could implement reverse geocoding here
        console.log("Map clicked at:", e.latlng);
    });
}
renderMap();
