import { Router, urlencoded } from 'express';
import Pizza from '../models/Pizza.js';

const router = Router();

// Create pizza route
router.post("/", async (request, response) => {
  try {
    const newPizza = new Pizza(request.body);

    const data = await newPizza.save();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Create pizza route
router.post("/form", urlencoded({ extended: true }), async (request, response) => {
  try {
    response.redirect(301, `${request.get('origin')}/pizza.html`)
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Get all pizzas route
router.get("/", async (request, response) => {
  try {
    // Store the query params into a JavaScript Object
    const query = request.query;

    const data = await Pizza.find(query).lean();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Get a single pizza by ID
router.get("/:id", async (request, response) => {
  try {
    const data = await Pizza.findById(request.params.id).lean();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors)
  }
});

// Update a single pizza by ID
router.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const data = await Pizza.findById(request.params.id);

    data.crust = body.crust;
    data.cheese = body.cheese;
    data.sauce = body.sauce;
    data.toppings = body.toppings;

    await data.save();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Delete a pizza by ID
router.delete("/:id", async (request, response) => {
  try {
    const data = await Pizza.findByIdAndRemove(request.params.id);

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

export default router;
