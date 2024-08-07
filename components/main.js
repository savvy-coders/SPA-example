import html from "html-literal";
import * as views from "../views";

export default state => {
  console.log('matsinet-main.js:5-views:', views);
  console.log('matsinet-main.js:6-state.view:', state.view);
  return html`<div id="main">${views[state.view](state)}</div>`;
}
