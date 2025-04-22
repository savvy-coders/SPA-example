import { Router } from "express";
import Appointment from "../models/Appointment.js";

const router = Router();

// Create record in MongoDB Atlas using Mongoose.js ORM
router.post("/", async (request, response) => {
  try {
    const appointment = new Appointment(request.body);
    const data = await appointment.save();
    response.json(data);
  } catch (error) {
    return response.status(500).json(error);
  }
});

// Get all records using a query parameters
router.get("/", async (request, response) => {
  try {
    // const query = request.query || {};
    const data = await Appointment.find();
    response.json(data);
  } catch (error) {
    return response.status(500).json(error);
  }
});

// Get a single record by ID
router.get("/:id", async (request, response) => {
  try {
    const data = await Appointment.findById(request.params.id);
    response.json(data);
  } catch (error) {
    return response.status(500).json(error);
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const data = await Appointment.findByIdAndRemove(request.params.id);
    return response.json(data);
  } catch (error) {
    return response.sendStatus(500).json(error);
  }
});

router.put("/:id", async (request, response) => {
  try {
    const body = request.body;
    const data = await Appointment.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          title: body.title,
          start: body.start,
          end: body.end,
          url: body.url,
          allDay: body.allDay
        }
      },
      {
        new: true,
        upsert: true
      }
    );
    response.json(data);
  } catch (error) {
    return response.sendStatus(500).json(error);
  }
});

export default router;
