import { header, nav, main, footer, spinner } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { camelCase } from "lodash";
import axios from "axios";
import { Canvas, PencilBrush } from "fabric";
import { showSpinner } from "./components/spinner";
import { addNavButtonEventHandler } from "./components/nav";
import { addDeleteButtonHandler } from "./views/pizza";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

let PIZZA_PLACE_API_URL;

if (process.env.PIZZA_PLACE_API_URL) {
  PIZZA_PLACE_API_URL = process.env.PIZZA_PLACE_API_URL ?? "http://localhost:4040";
} else {
  console.error(
    "Please create the .env file with a value for PIZZA_PLACE_API_URL"
  );
}

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
    ${header(state)}
    ${nav(store.nav)}
    ${spinner(store.spinner)}
    ${main(state)}
    ${footer()}
  `;
}

function handleEventDragResize(info) {
  const event = info.event;

  const start = event.start.toJSON();
  const end = event.allDay ? start : event.end.toJSON();

  if (confirm("Are you sure about this change?")) {
    const requestData = {
      title: event.title,
      start,
      end,
      url: event.url
    };

    axios
      .put(`${process.env.API_URL}/appointments/${event.id}`, requestData)
      .then(response => {
        console.log(
          `Event '${response.data.title}' (${response.data._id}) has been updated.`
        );
      })
      .catch(error => {
        info.revert();
        console.log("It puked", error);
      });
  } else {
    info.revert();
  }
}

router.hooks({
  // Use object deconstruction to store the data and (query)params from the Navigo match parameter
  // Runs before a route handler that the match is hasn't been visited already
  before: async (done, match) => {
    console.info('router before hook has fired!');

    showSpinner();

    // Check if data is null, view property exists, if not set view equal to "home"
    // using optional chaining (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    const id = match?.data?.id ? match.data.id : "";

    switch (view) {
      case "home":
        const kelvinToFahrenheit = kelvinTemp => Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

        try {
          const positionResponse = await new Promise((resolve, reject) => {
            const options = {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }

            return navigator.geolocation.getCurrentPosition(resolve, reject, options);
          });

          const location = { latitude: positionResponse.coords.latitude, longitude: positionResponse.coords.longitude };

          const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}8&lon=${location.longitude}&limit=3&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`);

          const city = geoResponse.data[0];

          const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=${city.name},${city.state}`);
          console.log('matsinet- weatherResponse', weatherResponse);

          store.home.weather = {
            city: weatherResponse.data.name,
            temp: kelvinToFahrenheit(weatherResponse.data.main.temp),
            feelsLike: kelvinToFahrenheit(weatherResponse.data.main.feels_like),
            description: weatherResponse.data.weather[0].main
          };

          done();
        } catch (error) {
          console.error("Error retrieving weather data", error);

          done();
        }
        break;
      case "pizza":
        try {
          const response = await axios.get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`);

          store.pizza.pizzas = response.data;

          done();
        } catch (error) {
          console.log("Error retrieving pizza data", error);

          done();
        }
        break;
      case "leaflet":
        try {
          const response = await axios
            .get(`https://developer.nps.gov/api/v1/parks?limit=40&api_key=${process.env.NPS_API_KEY}`);
          store.leaflet.parks = response.data.data;
          done();
        } catch (error) {
          console.log("Error retrieving map data", error);

          done();
        }
        break;
      case "calendar":
        try {
          const response = await axios.get(`${process.env.API_URL}/appointments`);
          const events = response.data.map(event => {
            return {
              id: event._id,
              title: event.title || event.customer,
              start: new Date(event.start),
              end: new Date(event.end),
              url: `/appointment/${event._id}`,
              allDay: event.allDay || false
            };
          });
          store.calendar.appointments = events;
          done();
        } catch (error) {
          console.log("Error retrieving calendar data", error);

          done();
        }

        break;
      case "appointment":
        try {
          const response = await axios.get(`${process.env.API_URL}/appointments/${id}`);
          console.log('matsinet-index.js:167-response.data:', response.data);
          store.appointment.event = {
            id: response.data._id,
            title: response.data.title || response.data.customer,
            start: new Date(response.data.start),
            end: new Date(response.data.end),
            url: `/appointment/${response.data._id}`
          };
          done();
        } catch (error) {
          console.log("Error retrieving appointment data", error);

          done();
        }
        break;
      default:
        done();
    }
  },
  // Runs before a route handler that is already the match is already being visited
  already: async (match) => {
    console.info('router already hook has fired!');
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    render(store[view]);

    addNavButtonEventHandler();

    if (view === 'pizza') addDeleteButtonHandler();
  },
  leave: async (done, match) => {
    console.info('router leave hook has fired!');

    done();
  },
  after: async (match) => {
    console.info('router after hook has fired!');
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    const id = match?.data?.id ? match.data.id : "";

    // Add menu toggle to bars icon in nav bar which is rendered on every page
    addNavButtonEventHandler();

    router.updatePageLinks();

    switch (view) {
      case "home":
        document.getElementById('action-button').addEventListener('click', event => {
          event.preventDefault();

          alert('Hello! You clicked the action button! Redirecting to the pizza view');

          router.navigate('/pizza');
        });
        break;
      case "order":
        document.querySelector("form").addEventListener("submit", async event => {
          event.preventDefault();

          const inputList = event.target.elements;
          console.log('matsinet-inputList', inputList);

          const toppings = [];
          for (let input of inputList.toppings) {
            if (input.checked) {
              toppings.push(input.value);
            }
          }

          const requestData = {
            crust: inputList.crust.value,
            cheese: inputList.cheese.value,
            sauce: inputList.sauce.value,
            toppings: toppings,
            customer: {
              name: inputList['customer-name'].value
            },
          };

          await axios
            .post(`${PIZZA_PLACE_API_URL}/pizzas`, requestData)
            .then(response => {
              // Push the new pizza to the store so we don't have to reload from the API
              store.pizza.pizzas.push(response.data);

              router.navigate("/pizza");
            })
            .catch(error => {
              console.error("Error storing new pizza", error);

              router.navigate('/order');
            });
        });
        break;
      case "pizza":
        addDeleteButtonHandler();
        break;
      case "fabricDemo":
        console.log("fabric view after render fired");

        // Initialize fabric
        const canvas = new Canvas(
          document.getElementById("fabricCanvas"),
          {
            // Enable drawing mode
            isDrawingMode: true,
            height: 400,
            width: 600
          }
        );

        canvas.freeDrawingBrush = new PencilBrush(canvas);

        document.getElementById("fabricExport").addEventListener("click", event => {
          event.preventDefault();
          const json = canvas.toJSON();
          console.log('matsinet-index.js:196-json:', json);
        })

        document.getElementById("fabricClear").addEventListener("click", event => {
          event.preventDefault();
          const json = canvas.clear();
        })
        break;
      case "leaflet":
        // Initialize the map DOM element, set the focus point and zoom level
        const map = L.map('map').setView([51.505, -0.09], 13);

        // Initialize the background (earth) layer so that markers appear to belong somewhere
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Create a group of markers so we can get their outside bounding box
        var markerArray = [];

        // Iterate of the parks, create a marker and add it to the marker group
        store.leaflet.parks.forEach(park => {
          // console.log(`${park.name} is located at ${park.latitude}, ${park.longitude}`);

          const marker = L.marker([park.latitude, park.longitude])
            .bindPopup(`${park.name}<br>${park.addresses[0].city}, ${park.addresses[0].stateCode}`);

          markerArray.push(marker);
        });

        // Add marker group to the map so that it is displayed
        const group = L.featureGroup(markerArray).addTo(map);
        // Force the map to zoom to the bounds of the group
        map.fitBounds(group.getBounds());
        break;
      case "appointment":
        const deleteButton = document.getElementById("delete-appointment");
        deleteButton.addEventListener("click", event => {
          deleteButton.disabled = true;

          if (confirm("Are you sure you want to delete this appointment")) {
            axios
              .delete(
                `${process.env.API_URL}/appointments/${event.target.dataset.id}`
              )
              .then(response => {
                // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
                console.log(
                  `Event '${response.data.title}' (${response.data._id}) has been deleted.`
                );
                router.navigate("/calendar");
              })
              .catch(error => {
                console.log("It puked", error);
              });
          } else {
            deleteButton.disabled = false;
          }
        });
        break;
      case "calendar":
        const calendarElement = document.getElementById("calendar");
        calendar = new Calendar(calendarElement, {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: "dayGridMonth",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          },
          buttonText: {
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            list: "List"
          },
          height: "100%",
          dayMaxEventRows: true,
          navLinks: true,
          editable: true,
          selectable: true,
          eventClick: function (info) {
            // change the border color just for fun
            info.el.style.borderColor = "red";
          },
          eventDrop: function (info) {
            handleEventDragResize(info);
          },
          eventResize: function (info) {
            handleEventDragResize(info);
          },
          select: info => {
            const title = prompt("Please enter a title");

            if (title) {
              const requestData = {
                title: title,
                start: info.start.toJSON(),
                end: info.end.toJSON(),
                allDay: info.view.type === "dayGridMonth"
              };

              axios
                .post(`${process.env.API_URL}/appointments`, requestData)
                .then(response => {
                  // Push the new pizza onto the Pizza state pizzas attribute, so it can be displayed in the pizza list
                  // response.data.title = response.data.title;
                  response.data.url = `/appointments/${response.data._id}`;
                  store.calendar.appointments.push(response.data);
                  console.log(
                    `Event '${response.data.title}' (${response.data._id}) has been created.`
                  );
                  calendar.addEvent(response.data);
                  calendar.unselect();
                })
                .catch(error => {
                  console.log("It puked", error);
                });
            } else {
              calendar.unselect();
            }
          },
          events: store.calendar.appointments || []
        });
        calendar.render();
        break;
      case "newAppointment":
        document.querySelector("form").addEventListener("submit", async event => {
          event.preventDefault();

          try {
            const inputList = event.target.elements;

            const requestData = {
              title: inputList.title.value,
              allDay: inputList.allDay.checked,
              start: new Date(inputList.start.value).toJSON(),
              end: new Date(inputList.end.value).toJSON()
            };

            const response = await axios.post(`${process.env.API_URL}/appointments`, requestData);

            store.calendar.appointments.push(response.data);

            router.navigate("/calendar");
          } catch (error) {
            console.log("It puked", error);
          }
        });
        break;
    }

    showSpinner(false);
  }
});

router
  .on({
    "/": () => render(),
    // Add a route handler for the routes that have two slots, one for view and one for id
    ":view/:id": (match) => {
      // Change the :view data element to camel case and remove any dashes (support for multi-word views)
      const view = match?.data?.view ? camelCase(match.data.view) : "home";
      if (view in store) {
        render(store[view]);
      } else {
        console.log(`View ${view} not defined`);
        render(store.viewNotFound);
      }
    },
    ":view": (match) => {
      // Change the :view data element to camel case and remove any dashes (support for multi-word views)
      const view = match?.data?.view ? camelCase(match.data.view) : "home";
      if (view in store) {
        render(store[view]);
      } else {
        console.log(`View ${view} not defined`);
        render(store.viewNotFound);
      }
    }
  })
  .resolve();

export default router;
