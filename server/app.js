import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pizzas from "./controllers/pizzas.js";
import appointments from "./controllers/appointments.js";
import drawings from "./controllers/drawings.js";
import contacts from "./controllers/contacts.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();

// Logging Middleware Declaration
const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${new Date().toLocaleString("en-us")}`);
  next();
};

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

// Use the defined Middleware
app.use(cors({
  origin: "http://localhost:1234",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// Moving the logging middleware to this location so that the logs on render.com are not filled up with status checks
app.use(logging);

// Per the Better Auth docs this must be above the express.json invocation
app.all('/auth/*', toNodeHandler(auth));

app.use(express.json({limit: '2mb'}));

// Use the controllers
app.use("/pizzas", pizzas);
app.use("/appointments", appointments);
app.use("/drawings", drawings);
app.use("/contacts", contacts);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;
