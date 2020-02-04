import mongoose from "mongoose";
import { TYPE } from "@/api/database/constants/collections.constants";

const typeSchema: mongoose.Schema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true
  }
});

typeSchema.plugin(require("mongoose-autopopulate"));
export default mongoose.model(TYPE, typeSchema);
