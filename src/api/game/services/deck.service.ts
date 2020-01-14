import database from "@/api/game/services/database.service"
import { DECK, PLAYER } from "@/api/database/constants/collections.constants"
import { START_CARDS } from "@/api/game/constants/rules.constants"
import { DISTRICT_TYPE } from "@/api/game/constants/deck.constants"

export const shuffle = (cards: any): any => {
  const cardsNumber = cards.length
  for (let i = 0; i < cardsNumber; i++) {
    const random = Math.floor(Math.random() * cardsNumber)
    const tmp = cards[i]
    cards[i] = cards[random]
    cards[random] = tmp
  }
  return cards
}

export const distributeCardsBetweenPlayers = async () => {
  const deck = (await database.getAll(DECK, { type: DISTRICT_TYPE })).data[0]
  const cards = deck.cards
  const players = (await database.getAll(PLAYER)).data

  for (const player of players) {
    const playerHand = []
    for (let i = 0; i < START_CARDS; i++) {
      playerHand.push(cards[0])
      cards.shift()
    }

    const playerParameters = [
      { _id: player._id },
      { hand: playerHand }
    ]
    await database.update(PLAYER, playerParameters)
  }

  const deckParameters = [
    { _id: deck._id },
    {
      cards_number: cards.length,
      cards: cards
    }
  ]
  await database.update(DECK, deckParameters)
}

export const draw = async (cardsToDraw: number = 1) => {
  const districtDeck = (await database.getAll(DECK, { type: DISTRICT_TYPE })).data[0]

  let cards = []
  for (let i = 0; i < cardsToDraw; i++) {
    console.log(districtDeck.cards[0])
    cards.push(districtDeck.cards[0])
    districtDeck.cards.shift()
  }

  return cards
}
