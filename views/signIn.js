import html from "html-literal";

export default state => {
  return html`
    <form id="signin-form">
      <div>
        <label for="email"></label>
        <input id="email" name="email" type="email">
      </div>
      <div>
        <label for="password"></label>
        <input id="password" name="password" type="password">
      </div>
      <div>
        <input type="submit" value="Sign In">
      </div>
    </form>
  `;
}
