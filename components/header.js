import html from "html-literal";

export default state => {
  return html`
    <header>
      <h1>${state.header}</h1>
    </header>
  `;
}

export const hooks = {
  async after(match) {
    // Add menu toggle to bars icon in nav bar which is rendered on every page
    document
      .querySelector(".fa-bars")
      .addEventListener("click", () =>
        document.querySelector("nav > ul").classList.toggle("hidden--mobile")
      );
  }
}
