import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pizzas from "./controllers/pizzas.js";
import appointments from "./controllers/appointments.js";
import drawings from "./controllers/drawings.js";
import contacts from "./controllers/contacts.js";

dotenv.config();

const app = express();

// Logging Middleware Declaration
const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${new Date().toLocaleString("en-us")}`);
  next();
};

// Use the defined Middleware
app.use(cors());
app.use(express.json({limit: '2mb'}));

const MONGODB = process.env.MONGODB ?? "mongodb://localhost/pizza";

// Database connection
mongoose.connect( MONGODB );
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once(
  "open",
  console.log.bind(console, "Successfully opened connection to Mongo!")
);

// Define a status route
app.get("/status", (request, response) => {
  response.send(JSON.stringify({ message: "Service running ok" }));
});

// Moving the logging middleware to this location so that the logs on render.com are not filled up with status checks
app.use(logging);

// Use the controllers
app.use("/pizzas", pizzas);
app.use("/appointments", appointments);
app.use("/drawings", drawings);
app.use("/contacts", contacts);

const PORT = process.env.PORT ?? 4040;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;
