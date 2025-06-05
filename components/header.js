import html from "html-literal";

export default state => {
  return html`
    <header class="page-header">
      <h1>${state.header}</h1>
    </header>
  `;
}
