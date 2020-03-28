import mongoose from "mongoose";
import { CHARACTER } from "@/api/database/constants/collections.constants";

const characterSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  image: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    required: true
  },

  index: {
    type: Number,
    required: true,
    unique: false
  }
});

characterSchema.plugin(require("mongoose-autopopulate"));
export default mongoose.model(CHARACTER, characterSchema);
