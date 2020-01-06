import mongoose from "mongoose"
import { OBJECT_ID } from "@/api/database/constants/types.constants"
import { CHARACTER, DISTRICT, PLAYER } from "@/api/database/constants/collections.constants"

const playerSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  money: {
    type: Number,
    required: true
  },

  character_id: {
    type: OBJECT_ID,
    ref: CHARACTER,
    autopopulate: true
  },

  districts: [{
    type: OBJECT_ID,
    ref: DISTRICT,
    autopopulate: true
  }],

  crown: {
    type: Boolean
  }
})

playerSchema.plugin(require("mongoose-autopopulate"))
export default mongoose.model(PLAYER, playerSchema)
