const mongoose = require("mongoose");

const Inventory = new mongoose.Schema({
  InventoryType: {
    type: "String",
    required: [true, "InventoryType is required"],
    enum: ["in", "out"],
  },
  bloodGroups: {
    type: "String",
    required: [true, "BloodGroups is required"],
    enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Organisation is required"],
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: function () {
      if (this.InventoryType === "out") {
        return true;
      }
    },
  },
  donar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: function () {
      return this.InventoryType === "in";
    },
  },
});

module.exports = mongoose.model("Inventory", Inventory);
