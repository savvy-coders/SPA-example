import html from "html-literal";

export default state => {
  return html`
    <section id="spinner-component">
      <div class="loader"></div>
    </section>
  `;
}

export function showSpinner(isShown = true) {
  console.info(`spinner component showSpinner method has fired with the value: ${isShown}!`);

  const spinnerComponent = document.getElementById('spinner-component');

  if (spinnerComponent && isShown) spinnerComponent.classList.add('show-spinner');

  if (spinnerComponent && !isShown) spinnerComponent.classList.remove('show-spinner');
}
