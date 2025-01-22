import { Router, urlencoded } from 'express';
import Drawing from '../models/Drawing.js';

const router = Router();

// Create drawing route
router.post("/", async (request, response) => {
  try {
    const newDrawing = new Drawing(request.body);

    const data = await newDrawing.save();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Get all drawings route
router.get("/", async (request, response) => {
  try {
    // Store the query params into a JavaScript Object
    const query = request.query;

    const data = await Drawing.find(query).lean();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Get a single drawing by ID
router.get("/:id", async (request, response) => {
  try {
    const data = await Drawing.findById(request.params.id).lean();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors)
  }
});

// Update a single drawing by ID
router.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const data = await Drawing.findById(request.params.id);

    data.title = body.title;
    data.svg = body.svg;
    data.json = body.json;

    await data.save();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Delete a drawing by ID
router.delete("/:id", async (request, response) => {
  try {
    const data = await Drawing.findByIdAndRemove(request.params.id);

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

export default router;
