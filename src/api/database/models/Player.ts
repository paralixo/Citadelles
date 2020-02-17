import mongoose from "mongoose"
import { OBJECT_ID } from "@/api/database/constants/types.constants"
import { CHARACTER, DISTRICT, PLAYER } from "@/api/database/constants/collections.constants"

const playerSchema: mongoose.Schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
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

  hand: [{
    type: OBJECT_ID,
    ref: DISTRICT,
    autopopulate: true
  }],

  temporary_hand: [{
    type: OBJECT_ID,
    ref: DISTRICT,
    autopopulate: true
  }],

  board: [{
    type: OBJECT_ID,
    ref: DISTRICT,
    autopopulate: true
  }],

  isFinished: {
    type: Boolean,
    required: true,
    default: false
  },

  targetedBy: {
    type: String,
    required: true,
    default: ""
  },

  crown: {
    type: Boolean
  }
})

playerSchema.plugin(require("mongoose-autopopulate"))
export default mongoose.model(PLAYER, playerSchema)
