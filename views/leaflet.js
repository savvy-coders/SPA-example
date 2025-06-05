import html from "html-literal";

export default state => {
  return html`
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <!-- <h3 id="leaflet-example">
      Leaflet Example
    </h3> -->
    <div id="map"></div>
  `;
}
