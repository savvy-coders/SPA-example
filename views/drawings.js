import html from "html-literal";
import axios from "axios";
import router from "..";
import * as store from "../store";
import "../assets/css/drawings.css"

export default state => {
  return html`
    <section class="action-menu">
      <a href="/fabric-demo" class="action-button" data-navigo>New Drawing</a>
    </section>
    <table id="drawings">
      <thead>
      <th>Title</th>
      <th>Created</th>
      <th class="action-column">Actions</th>
      </thead>
      ${state.drawings
        .map(drawing => {
          return html`
            <tr>
              <td>${drawing.title}</td>
              <td>${drawing.createdAt}</td>
              <td class="action-column">
                <button class="action-button action-button-danger delete-button" data-id="${drawing._id}" data-name="${drawing.title}">Delete</button>
                <a class="action-button action-button-success" href="/fabric-demo/${drawing._id}" data-navigo>View</a>
              </td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;
}

export async function loadAllDrawings(done = () => {}) {
  try {
    const response = await axios.get(`${process.env.API_URL}/drawings`);

    store.drawings.drawings = response.data;

    done();
  } catch (error) {
    console.log("Error retrieving drawings data", error);

    done();
  }
}

export function addDeleteDrawingButtonHandler() {
  console.log("Adding Drawing delete click handlers");
  document.querySelectorAll('.delete-button')
  .forEach(domElement => {
    domElement.addEventListener('click', async event => {
      const { id, name } = event.target.dataset;


      if (confirm(`Are you sure you want to delete this drawing for ${name}`)) {
        await axios
          .delete(`${process.env.API_URL}/drawings/${id}`)
          .then(async deleteResponse => {
            if (deleteResponse.status === 200) {
              console.log(`Drawing ${id} was successfully deleted`);
            }

            // Update the list of pizza after removing the pizza
            await axios
              .get(`${process.env.API_URL}/drawings`)
              .then((response) => {
                store.drawings.drawings = response.data;
                // Reload the existing page, thus firing the already hook
                router.navigate('/drawings');
              })
              .catch((error) => {
                console.error("Error retrieving drawings", error);

                router.navigate('/drawings');
              });
          })
          .catch(error => {
            console.error("Error deleting drawing", error);

            router.navigate('/drawings');
          })
      }
    });
  });
}

export function addViewDrawingButtonHandler() {
  console.log("Adding Drawing view click handlers");
  document.querySelectorAll('.view-button')
  .forEach(domElement => {
    domElement.addEventListener('click', async event => {
      const { id, name } = event.target.dataset;
      router.navigate(`/fabric-demo/${id}`);
    });
  });
}
