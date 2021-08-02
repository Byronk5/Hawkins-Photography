const conditions = document.querySelector(".conditions");
const minTemp = document.querySelector(".temp-min");
const maxTemp = document.querySelector(".temp-max");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const date = document.getElementById("date");
const weatherButton = document.querySelector(".weather-button");
const icon = document.querySelector(".icon");

class City {
  async getCityID() {
    let response = await fetch(
      "https://www.metaweather.com/api/location/search/?query=cape"
    );
    let data = await response.json();
    return data[0];
  }
}

class Weather {
  async getWeather(cityId) {
    const dateValue = date.value;
    const userDate = dateValue.replace(/-/g, "/");
    let response = await fetch(
      `https://www.metaweather.com/api/location/${cityId}/${userDate}`
    );
    let data = await response.json();
    return data;
  }
}

class UI {
  displayWeatherData(weatherData) {
    let data = weatherData[0];
    console.log(data);
    let conditionsInfo = data.weather_state_name;

    switch (conditionsInfo) {
      case "Heavy Cloud":
        icon.innerHTML = `<i class="fas fa-cloud"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Light Cloud":
        icon.innerHTML = `<i class="fas fa-cloud"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Clear":
        icon.innerHTML = `<i class="fas fa-sun"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Heavy Rain":
        icon.innerHTML = `<i class="fas fa-cloud-showers-heavy"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Light Rain":
        icon.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Showers":
        icon.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Thunderstorm":
        icon.innerHTML = `<i class="fas fa-bolt"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Hail":
        icon.innerHTML = `<i class="fas fa-snowflake"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Sleet":
        icon.innerHTML = `<i class="fas fa-snowflake"></i>`;
        conditions.innerText = conditionsInfo;
        break;
      case "Snow":
        icon.innerHTML = `<i class="fas fa-snowflake"></i>`;
        conditions.innerText = conditionsInfo;
        break;
    }
    minTemp.innerText = parseInt(data.min_temp);
    maxTemp.innerText = parseInt(data.max_temp);

    let mph = data.wind_speed;
    let kmh = mph / 0.6214;
    wind.innerText = parseInt(kmh);
    humidity.innerText = data.humidity;
  }
}

const city = new City();
const weather = new Weather();
const ui = new UI();

city.getCityID().then((id) => {
  const cityId = id.woeid;
  weatherButton.addEventListener("click", () => {
    weather.getWeather(cityId).then((weatherData) => {
      ui.displayWeatherData(weatherData);
    });
  });
});
