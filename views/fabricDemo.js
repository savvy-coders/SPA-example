import html from "html-literal";
import { Canvas, PencilBrush } from "fabric";
import { canvas } from "leaflet";
import axios from "axios";
import * as store from "../store";

export default state => {
  return html`
    <form id="drawing-form">
      <section style="margin-left: 2rem;">
        <label for="title">Title</label>
        <input type="text" name="title" id="title">
      </section>
      <section id="fabricDemo" style="margin: 2rem;">
        <canvas id="fabricCanvas" style="border: black solid 3px; margin-bottom: 1rem;"></canvas>
      </section>
      <section style="margin-left: 2rem;">
        <input type="submit" value="Save to API" class="action-button-dark">
        <button id="exportJSON" class="action-button-dark">Console Log JSON</button>
        <button id="exportSVG" class="action-button-dark">Console Log SVG</button>
        <button id="fabricClear" class="action-button-dark">Clear</button>
      </section>
    </form>
  `;
}

export async function setupFabricDemo(id = "") {
  console.log("fabric view after render fired");

  // Initialize fabric
  var drawingCanvas = new Canvas(
    document.getElementById("fabricCanvas"),
    {
      // Enable drawing mode
      isDrawingMode: true,
      height: 400,
      width: 600
    }
  );

  drawingCanvas.freeDrawingBrush = new PencilBrush(drawingCanvas);

  // Store the Fabric canvas in state so that I can use it outside this function
  store.fabricDemo.canvas = drawingCanvas;

  document.getElementById("exportJSON").addEventListener("click", event => {
    event.preventDefault();
    const json = drawingCanvas.toJSON();
    const jsonString = JSON.stringify(json)
    console.log('Fabric JSON export:', jsonString);
    console.log('Fabric JSON export length:', jsonString.length);
    alert("Please open Developer Tools Console tab to see the output");
  })

  document.getElementById("exportSVG").addEventListener("click", event => {
    event.preventDefault();
    const svg = drawingCanvas.toSVG();
    console.log('Fabric SVG export:', svg);
    console.log('Fabric SVG export length:', svg.length);
    alert("Please open Developer Tools Console tab to see the output");
  })

  document.getElementById("fabricClear").addEventListener("click", event => {
    event.preventDefault();
    drawingCanvas.clear();
  })

  document.getElementById('drawing-form').addEventListener('submit', async event => {
    event.preventDefault();

    const requestData = {
      title: event.target.elements.title.value,
      // svg: drawingCanvas.toSVG(),
      json: JSON.stringify(drawingCanvas.toJSON())
    }


    const requestConfig = {
      url: `${process.env.API_URL}/drawings/${id}`,
      method: id ? 'PUT' : 'POST',
      data: requestData
    }

    await axios
      .request(requestConfig)
      .then(response => {
        // Push the new pizza to the store so we don't have to reload from the API
        store.drawings.drawings.push(response.data);

        store.global.router.navigate("/drawings");
      })
      .catch(error => {
        console.error("Error storing new pizza", error);

        store.global.router.navigate('/fabric-demo');
      });
  });
}

export async function loadDrawingDataFromId(id, done) {
  try {
    const response = await axios.get(`${process.env.API_URL}/drawings/${id}`);

    store.fabricDemo.drawing = response.data;

    done();
  } catch (error) {
    console.log("Error retrieving drawing data", error);

    done();
  }
}

export async function loadDrawingFromID(id) {
  try {
    const response = await axios.get(`${process.env.API_URL}/drawings/${id}`);
    const drawing = response.data;

    store.fabricDemo.drawing = drawing;

    document.getElementById('title').value = drawing.title;

    store.fabricDemo.canvas.loadFromJSON(drawing.json).then((canvas) => canvas.requestRenderAll());

  } catch (error) {
    console.log("Error retrieving drawing data", error);
  }
}
