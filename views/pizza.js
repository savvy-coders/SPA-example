import html from "html-literal";
import axios from "axios";
import router from "../";
import * as store from "../store";
import "../assets/css/pizza.css"

export default state => {
  return html`
    <table id="pizzas">
      <thead>
      <th>Crust</th>
      <th>Cheese</th>
      <th>Sauce</th>
      <th>Toppings</th>
      <th>Customer Name</th>
      <th id="action-column">Actions</th>
      </thead>
      ${state.pizzas
        .map(pizza => {
          return html`
            <tr>
              <td>${pizza.crust}</td>
              <td>${pizza.cheese}</td>
              <td>${pizza.sauce}</td>
              <td>${pizza.toppings.join(" & ")}</td>
              <td>${pizza?.customer?.name || "Anonymous"}</td>
              <td class="text-center">
                <div class="delete-button" data-id="${pizza._id}" data-name="${pizza?.customer?.name || "Anonymous"}">Delete</div>
              </td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;
}

export function addDeleteButtonHandler() {
  document.querySelectorAll('.delete-button')
  .forEach(domElement => {
    domElement.addEventListener('click', async event => {
      const { id, name } = event.target.dataset;


      if (confirm(`Are you sure you want to delete this pizza for ${name}`)) {
        await axios
          .delete(`${process.env.PIZZA_PLACE_API_URL}/pizzas/${id}`)
          .then(async deleteResponse => {
            if (deleteResponse.status === 200) {
              console.log(`Pizza ${id} was successfully deleted`);
            }

            // Update the list of pizza after removing the pizza
            await axios
              .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
              .then((response) => {
                store.pizza.pizzas = response.data;
                // Reload the existing page, thus firing the already hook
                router.navigate('/pizza');
              })
              .catch((error) => {
                console.error("Error retrieving pizzas", error);

                router.navigate('/pizza');
              });
          })
          .catch(error => {
            console.error("Error deleting pizza", error);

            router.navigate('/pizza');
          })
      }
    });
  });
}
