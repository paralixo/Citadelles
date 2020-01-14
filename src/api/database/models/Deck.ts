import mongoose from "mongoose"
import { OBJECT_ID } from "@/api/database/constants/types.constants"
import { DECK, DISTRICT } from "@/api/database/constants/collections.constants"

const deckSchema: mongoose.Schema = new mongoose.Schema({
  cards_number: {
    type: Number,
    required: true
  },

  cards: [{
    type: OBJECT_ID,
    refPath: "onModel",
    autopopulate: true
  }],

  type: {
    type: String,
    required: true
  }
})

deckSchema.plugin(require("mongoose-autopopulate"))
export default mongoose.model(DECK, deckSchema)
