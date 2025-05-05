import html from "html-literal";

export default state => {
  return html`
    <form id="register-form">
      <div>
        <label for="name"></label>
        <input id="name" name="name" type="text">
      </div>
      <div>
        <label for="email"></label>
        <input id="email" name="email" type="email">
      </div>
      <div>
        <label for="password"></label>
        <input id="password" name="password" type="password">
      </div>
      <div>
        <input type="submit" value="Register">
      </div>
    </form>
  `;
}
