const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    tables: {
      type: Array,
      default: []
    },
    relationships: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", designSchema);
