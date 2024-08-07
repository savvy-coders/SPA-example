import html from "html-literal";
import "../assets/css/pizza.css"
import router from "../";
import * as store from "../store";

export default state => {
  return html`
    <table id="pizzas">
      <thead>
      <th>Crust</th>
      <th>Cheese</th>
      <th>Sauce</th>
      <th>Toppings</th>
      <th>Customer Name</th>
      <th>Customer Postal Code</th>
      <th id="action-column">Actions</th>
      </thead>
      ${state.pizzas
      .map(pizza => {
        return `<tr>
    <td>${pizza.crust}</td>
    <td>${pizza.cheese}</td>
    <td>${pizza.sauce}</td>
    <td>${pizza.toppings.join(" & ")}</td>
    <td>${pizza.customer.name}</td>
    <td>${pizza.customer.postalCode}</td>
    <td class="text-center">
      <div class="delete-button" data-id="${pizza._id}" data-name="${pizza.customer.name}">Delete</div>
    </td>
    </tr>`;
      })
      .join("")}
    </table>
  `;
}

export const hooks = {
  async before(done, match) {
    try {
      const response = await axios.get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`);

      store.pizza.pizzas = response.data;

      done();
    } catch (error) {
      console.log("Error retrieving pizza data", error);

      done();
    }
  },
  async after(match) {
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
}
