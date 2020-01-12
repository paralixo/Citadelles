import { CHARACTER_TEST_ID, TYPE_TEST_ID } from "./objectids.constants"

export const CHARACTER_TEST_DATA: object = {
  name: "test character",
  image: "character.jpg",
  description: "test data",
  index: 1
}

export const DECK_TEST_DATA: object = {
  cards_number: 0,
  districts: []
}

export const DISTRICT_TEST_DATA: object = {
  name: "test district",
  image: "district.jpg",
  description: "test data",
  price: 1,
  type: TYPE_TEST_ID
}

export const PLAYER_TEST_DATA: object = {
  name: "test player",
  money: 10,
  character_id: CHARACTER_TEST_ID,
  hand: [],
  board: [],
  crown: false
}

export const TYPE_TEST_DATA: object = {
  label: "test type"
}
