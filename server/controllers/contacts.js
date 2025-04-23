import { Router, urlencoded } from 'express';
import Contact from '../models/Contact.js';
import sendgrid from "@sendgrid/mail";
import { contactHtmlEmail, contactTextEmail } from "../templates/index.js";

const router = Router();

// Create contact route
router.post("/", async (request, response) => {
  try {
    const newContact = new Contact(request.body);

    const data = await newContact.save();
    
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    
    const from = process.env.SENDGRID_FROM || 'matt@savvycoders.com';
    const to = process.env.SENDGRID_TO || 'matt@savvycoders.com';
    
    const message = {
      to,
      from,
      subject: `A contact message from ${data.name}`,
      text: contactTextEmail(data),
      html: contactHtmlEmail(data),
    };
  
    sendgrid.send(message)
      .then(() => {
        response.json(data);
      })
      .catch(error => {
        response.status(500).json(error.message);
      })
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Get all contacts route
router.get("/", async (request, response) => {
  try {
    // Store the query params into a JavaScript Object
    const query = request.query;

    const data = await Contact.find(query).lean();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Get a single contact by ID
router.get("/:id", async (request, response) => {
  try {
    const data = await Contact.findById(request.params.id).lean();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors)
  }
});

// Update a single contact by ID
router.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const data = await Contact.findById(request.params.id);

    data.name = body.name;
    data.email = body.email;
    data.message = body.message;

    await data.save();

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);

    return response.status(500).json(error.errors);
  }
});

// Delete a contact by ID
router.delete("/:id", async (request, response) => {
  try {
    const data = await Contact.findByIdAndRemove(request.params.id);

    response.json(data);
  } catch(error) {
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

export default router;
