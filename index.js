import { header, nav, main, footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";
import { hooks as homeHooks } from "./views/home";
import { hooks as pizzaHooks } from "./views/pizza";
import { hooks as orderHooks } from "./views/order";
import { hooks as headerHooks } from "./components/header";

const router = new Navigo("/");

function render(match) {
  const viewName = match?.route?.name ? camelCase(match.route?.name) : "home";

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

    render(match);

    headerHooks.after(match);
  },
  after: async (match) => {
    console.info("Global router.hook after execution");

    headerHooks.after(match);

    router.updatePageLinks();
  }
});

router.notFound(render);

router
  .on({
    "/": { uses: render, hooks: homeHooks },
    "/home": { uses: render, hooks: homeHooks },
    "/about-me": { uses: render },
    "/order": { uses: render, hooks: orderHooks },
    "/pizza": { uses: render, hooks: pizzaHooks }
  })
  .resolve();

export default router;
