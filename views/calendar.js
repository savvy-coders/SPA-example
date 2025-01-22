import html from "html-literal";
import "../assets/css/calendar.css";

export default state => html`
  <section class="action-menu">
    <a href="/new-appointment" class="action-button" data-navigo>New Appointment</a>
  </section>
  <div class="calendar-container">
    <div id="calendar"></div>
  </div>
`;
