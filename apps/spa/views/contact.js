import html from "html-literal";

export default (state) => {
  return html`
    <section id="contact-view">
      <form id="contact-form">
        <p>
          <label for="Name">Name</label><br />
          <input type="text" id="name"><label for="name">
        </p>
        <p>
          <label for="email">E-mail</label><br />
          <input type="text" name="email" id="email">
        </p>
        <p>
          <label for="message">Message</label><br />
          <textarea name="message" id="message"></textarea>
        </p>
        <p>
          <input type="submit" valuw="Submit"/>
        </p>
      </form>
    </section>
  `;
}