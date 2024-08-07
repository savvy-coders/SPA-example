import html from "html-literal";
import '../assets/css/home.css';
import axios from "axios";
import router from "../";
import * as store from "../store";

export default state => {
  return html`
    <h3 id="weather">
      Weather in ${state.weather.city} ${state.weather.temp}F, feels like ${state.weather.feelsLike}F
    </h3>
    <section id="jumbotron">
      <h2>SavvyCoders JavaScript Fullstack Bootcamp</h2>
      <a id="action-button">"Call to Action Button"</a>
    </section>
  `;
}

export const hooks = {
  async before(done, match) {
    try {
      const positionResponse = await new Promise((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }

        return navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const location = { latitude: positionResponse.coords.latitude, longitude: positionResponse.coords.longitude };

      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}8&lon=${location.longitude}&limit=3&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`);

      const city = geoResponse.data[0];

      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=${city.name},${city.state}&units=imperial`);
      console.log('matsinet- weatherResponse', weatherResponse);

      store.home.weather = {
        city: weatherResponse.data.name,
        temp: weatherResponse.data.main.temp,
        feelsLike: weatherResponse.data.main.feels_like,
        description: weatherResponse.data.weather[0].main
      };

      done();
    } catch (error) {
      console.error("Error retrieving weather data", error);

      done();
    }
  },
  async after(match) {
    document.getElementById('action-button').addEventListener('click', event => {
      event.preventDefault();

      alert('Hello! You clicked the action button! Redirecting to the pizza view');

      router.navigate('/pizza');
    });
  }
}



