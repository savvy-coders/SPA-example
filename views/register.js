import html from "html-literal";

export default state => {
  return html`
    <form action="">
      <div>
        <label for=""></label>
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
  