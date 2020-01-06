import mongoose from "mongoose"
import { BOARD, DISTRICT, PLAYER } from "@/api/database/constants/collections.constants"
import { OBJECT_ID } from "@/api/database/constants/types.constants"

const boardSchema: mongoose.Schema = new mongoose.Schema({
  player_id: {
    type: OBJECT_ID,
    ref: PLAYER,
    required: true,
    autopopulate: true
  },

  districts: {
    type: OBJECT_ID,
    ref: DISTRICT,
    required: true,
    autopopulate: true
  }
})

boardSchema.plugin(require("mongoose-autopopulate"))
export default mongoose.model(BOARD, boardSchema)
