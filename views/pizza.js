import html from "html-literal";
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
              <td>${pizza.customer.name}</td>
              <td class="text-center">
                <div class="delete-button" data-id="${pizza._id}" data-name="${pizza.customer.name}">Delete</div>
              </td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;
}
