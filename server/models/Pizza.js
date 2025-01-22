import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema({
  customer: {
    type: String,
    validate: /^[A-Za-z0-9 ]*$/,
    required: true
  },
  crust: {
    type: String,
    required: true,
    enum: ["Thin", "Hand Tossed", "Chicago", "Deep Dish", "thin", "chicago", "deep-dish", "hella-thick", "califlower"]
  },
  cheese: {
    type: String,
    validate: /^[A-Za-z0-9 ]*$/
  },
  sauce: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9 ]*$/
  },
  toppings: [String]
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
