import mongoose from "mongoose";
import { OBJECT_ID } from "@/api/database/constants/types.constants";
import { DISTRICT, TYPE } from "@/api/database/constants/collections.constants";

const districtSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  type: {
    type: OBJECT_ID,
    ref: TYPE,
    required: true,
    autopopulate: true
  }
});

districtSchema.plugin(require("mongoose-autopopulate"));
export default mongoose.model(DISTRICT, districtSchema);
