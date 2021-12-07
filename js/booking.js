const conditions = document.querySelector('.conditions');
const minTemp = document.querySelector('.temp-min');
const maxTemp = document.querySelector('.temp-max');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const date = document.getElementById('date');
const weatherButton = document.querySelector('.weather-button');
const icon = document.querySelector('.icon');

const form = document.querySelector('.booking-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const select = document.querySelector('.form-select');
const textArea = document.getElementById('text-area');
const errorDiv = document.getElementById('error');
const formNotification = document.querySelector('.form-notification');
const formSubmitButton = document.querySelector('.form-submit-button');

let errorMessages = [];

class City {
      async getCityID() {
            let response = await fetch(
                  'https://www.metaweather.com/api/location/search/?query=cape'
            );
            let data = await response.json();
            return data[0].woeid;
      }
}

class Weather {
      async getWeather(cityId) {
            const dateValue = date.value;
            const userDate = dateValue.replace(/-/g, '/');
            let response = await fetch(
                  `https://www.metaweather.com/api/location/${cityId}/${userDate}`
            );
            let data = await response.json();
            return data[0];
      }
}

class UI {
      displayWeatherData(weatherData) {
            let data = weatherData;
            let conditionsInfo = data.weather_state_name;

            switch (conditionsInfo) {
                  case 'Heavy Cloud':
                        icon.innerHTML = `<i class="fas fa-cloud"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Light Cloud':
                        icon.innerHTML = `<i class="fas fa-cloud"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Clear':
                        icon.innerHTML = `<i class="fas fa-sun"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Heavy Rain':
                        icon.innerHTML = `<i class="fas fa-cloud-showers-heavy"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Light Rain':
                        icon.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Showers':
                        icon.innerHTML = `<i class="fas fa-cloud-rain"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Thunderstorm':
                        icon.innerHTML = `<i class="fas fa-bolt"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Hail':
                        icon.innerHTML = `<i class="fas fa-snowflake"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Sleet':
                        icon.innerHTML = `<i class="fas fa-snowflake"></i>`;
                        conditions.innerText = conditionsInfo;
                        break;
                  case 'Snow':
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

      formSubmission() {
            form.addEventListener('submit', (e) => {
                  const nameInput = document.getElementById('name');
                  const emailInput = document.getElementById('email');

                  if (nameInput.value === '') {
                        errorMessages.push('Name is required!');
                  }

                  if (emailInput.value === '') {
                        errorMessages.push('Email is required!');
                  }

                  let isValid = this.validateEmail(emailInput.value);

                  if (!isValid) {
                        errorMessages.push(
                              'Please enter a valid email address!'
                        );
                  }

                  if (errorMessages.length > 0) {
                        errorDiv.innerText = errorMessages.join(', ');
                        this.formClear();
                        this.clearErrorMessages();
                        e.preventDefault();
                  }

                  if (errorMessages.length < 1) {
                        this.formSubmitNotification();
                  }
                  e.preventDefault();
            });
      }

      validateEmail(emailInput) {
            const regEx =
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return regEx.test(emailInput.toLowerCase());
      }

      clearErrorMessages() {
            nameInput.addEventListener('click', () => {
                  errorMessages = [];
                  errorDiv.innerText = '';
            });
      }

      formSubmitNotification() {
            formNotification.classList.add('form-notification-active');
            setTimeout(this.removeNotification, 2000);
            this.formClear();
      }
      removeNotification() {
            formNotification.classList.remove('form-notification-active');
      }

      formClear() {
            nameInput.value = '';
            emailInput.value = '';
            select.selectedIndex = 0;
            textArea.value = '';
      }
}

const city = new City();
const weather = new Weather();
const ui = new UI();

city.getCityID().then((id) => {
      const cityId = id;
      weatherButton.addEventListener('click', () => {
            weather.getWeather(cityId).then((weatherData) => {
                  ui.displayWeatherData(weatherData);
            });
      });
});

ui.formSubmission();
