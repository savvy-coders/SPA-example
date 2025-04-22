import html from "html-literal";
import '../assets/css/home.css';

export default state => {
  return html`
    <h3 id="weather">
      Weather in ${state.weather.city} ${state.weather.temp}F, feels like ${state.weather.feelsLike}F
    </h3>
    <section id="jumbotron">
      <h2>SavvyCoders JavaScript Fullstack Bootcamp</h2>
      <a id="action-button" class="action-button-light">"Call to Action Button"</a>
      <a id="view-code" class="action-button-light" href="https://github.com/savvy-coders/SPA-example" target="_blank">View GitHub Repository</a>
    </section>
  `;
}
