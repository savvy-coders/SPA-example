import html from "html-literal";
import "../assets/css/calendar.css";

export default state => html`
  <section class="calendar-menu">
    <a href="/appointment" class="action-button" data-navigo>Schedule New Appointment</a>
  </section>
  <div class="calendar-container">
    <div id="calendar"></div>
  </div>
`;
