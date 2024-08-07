import { header, nav, main, footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";
import { hooks as homeHooks } from "./views/home";
import { hooks as pizzaHooks } from "./views/pizza";
import { hooks as orderHooks } from "./views/order";

const router = new Navigo("/");

function render(viewName = 'home') {

  const state = store[viewName];

  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${nav(store.nav)}
    ${main(state)}
    ${footer()}
  `;
}

router.hooks({
  already: async (match) => {
    console.info("Global router.hook already execution");
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    render(store[view]);
  },
  after: async (match) => {
    console.info("Global router.hook after execution");
    // Add menu toggle to bars icon in nav bar which is rendered on every page
    document
      .querySelector(".fa-bars")
      .addEventListener("click", () =>
        document.querySelector("nav > ul").classList.toggle("hidden--mobile")
      );

    router.updatePageLinks();
  }
});

router.notFound(render('viewNotFound'));

router
  .on({
    "/": { uses: render(), hooks: homeHooks },
    "/home": { uses: render(), hooks: homeHooks },
    "/about-me": { uses: render('aboutMe') },
    "/order": { uses: render('order'), hooks: orderHooks },
    "/pizza": { uses: render('pizza'), hooks: pizzaHooks }
  })
  .resolve();

export default router;
