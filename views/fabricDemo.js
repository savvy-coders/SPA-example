import html from "html-literal";

export default state => {
  return html`
    <section id="fabricDemo" style="margin: 2rem;">
      <canvas id="fabricCanvas" style="border: black solid 3px; margin-bottom: 1rem;"></canvas>
    </section>
    <section style="margin: 2rem;">
      <button id="fabricExport">Export</button>
    </section>
  `;
}
