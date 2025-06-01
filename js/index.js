"use strict";

const searchBtn = document.getElementById("search-btn");
console.log("hello world");
const cityInput = document.getElementById("city-input");

async function weatherData(city) {
    let loader = document.querySelector(".loader");
    loader.style.display = "block";
    const API_KEY = "acea87296f26b47e5bec0d8ebc8fba0e";
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        loader.style.display = "none";
    }
    const data = await response.json();

    return data;
}

let html = "";
function renderHtml(data) {
    console.log(data);
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    // In the renderHtml function, fix these lines:
     html = `  
  <div class="body">
    <div class="main-left">
      <p class="city-date">May 30,12:00am</p>
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
      <div id="map" style="height: 400px; width: 100%;"></div>
    </div>
  </div>`;

    document.querySelector(".container").innerHTML = html;
}

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) {
        console.log("pls enter city name");
        return;
    }
    const getWeatherData = await weatherData(city);
    renderHtml(getWeatherData);
});
