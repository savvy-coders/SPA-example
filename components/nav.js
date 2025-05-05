import html from "html-literal";
// Example of using a component inside another component
import navItem from "./navItem.js";
import global from "../store/global.js";

export default navItems => {
  // console.log('isAuthenticated', global.isAuthenticated);
  return html`
    <nav>
      <i class="fas fa-bars"></i>
      <ul class="hidden--mobile nav-links">
        ${
          navItems.map(item => {
            // console.group('-- link', item.text, ' --');
            // console.log('isAuth', global.isAuthenticated);
            // console.log('canShow', item.canShow);
            // console.log('canShow=yes', item.canShow === 'yes');
            // console.log('canShow=anon & NOT isAuth', (!global.isAuthenticated && item.canShow === 'anon'))
            // console.log('canShow=auth & isAuth', (global.isAuthenticated && item.canShow === 'auth'))
            // console.groupEnd();
            if (item.canShow === 'yes' || (!global.isAuthenticated && item.canShow === 'anon') || (global.isAuthenticated && item.canShow === 'auth')) {
              return navItem(item)
            }
          }).join("")
        }
      </ul>
    </nav>
  `;
}

export function addNavButtonEventHandler() {
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("nav > ul").classList.toggle("hidden--mobile");
  });
}
