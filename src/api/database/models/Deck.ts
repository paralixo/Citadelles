import mongoose from "mongoose"
import { OBJECT_ID } from "@/api/database/constants/types.constants"
import { DECK, DISTRICT } from "@/api/database/constants/collections.constants"

const deckSchema: mongoose.Schema = new mongoose.Schema({
  cards_number: {
    type: Number,
    required: true
  },

  districts: [{
    type: OBJECT_ID,
    ref: DISTRICT,
    autopopulate: true
  }]
})

deckSchema.plugin(require("mongoose-autopopulate"))
export default mongoose.model(DECK, deckSchema)
