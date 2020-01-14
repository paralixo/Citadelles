import database from "@/api/game/services/database.service"
import { CHARACTER, DECK, DISTRICT, PLAYER } from "@/api/database/constants/collections.constants"
import { START_CARDS } from "@/api/game/constants/rules.constants"
import { DISTRICT_TYPE } from "@/api/game/constants/deck.constants"
import { IDeckData } from "@/api/game/interfaces/models/DeckData.interface"
import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface"
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface"

export const generateDeck = async (deckType: string) => {
  const collectionToGet: string = deckType === DISTRICT_TYPE ? DISTRICT : CHARACTER
  // TODO: type cards
  let cards = (await database.getAll(collectionToGet)).data
  cards = cards.map((card: any) => card._id)
  const deckParameters: IDeckData = {
    cards_number: cards.length,
    cards: shuffle(cards),
    type: deckType
  }

  await database.create(DECK, deckParameters)
}

export const getDeckByType = async (deckType: string): Promise<IDeckData> => {
  const condition: {type: string} = { type: deckType }
  const requestResult: IResponseData = await database.getAll(DECK, condition)
  // @ts-ignore
  return requestResult.data[0]
}

export const shuffle = (cards: string[]): string[] => {
  const cardsNumber: number = cards.length
  for (let i = 0; i < cardsNumber; i++) {
    const random = Math.floor(Math.random() * cardsNumber)
    const tmp = cards[i]
    cards[i] = cards[random]
    cards[random] = tmp
  }
  return cards
}

export const distributeCardsBetweenPlayers = async () => {
  const deck: IDeckData = (await database.getAll(DECK, { type: DISTRICT_TYPE })).data[0]
  const cards: string[] = deck.cards
  const players: IPlayerData[] = (await database.getAll(PLAYER)).data

  for (const player of players) {
    const playerHand: string[] = []
    for (let i = 0; i < START_CARDS; i++) {
      playerHand.push(cards[0])
      cards.shift()
    }

    const playerParameters: object[] = [
      { _id: player._id },
      { hand: playerHand }
    ]
    await database.update(PLAYER, playerParameters)
  }

  const deckParameters: object[] = [
    { _id: deck._id },
    {
      cards_number: cards.length,
      cards: cards
    }
  ]
  await database.update(DECK, deckParameters)
}

export const draw = async (cardsToDraw: number): Promise<string[]> => {
  const districtDeck: IDeckData = (await database.getAll(DECK, { type: DISTRICT_TYPE })).data[0]

  let cards: string[] = []
  for (let i = 0; i < cardsToDraw; i++) {
    cards.push(districtDeck.cards[0])
    districtDeck.cards.shift()
  }
  // TODO: update districtDeck
  return cards
}

export const discardFromDeck = async (deck: IDeckData, cardId: string) => {
  const cardIndex: number = deck.cards.indexOf(cardId)
  deck.cards.splice(cardIndex, 1)
  const deckParameters: object[] = [
    { _id: deck._id },
    {
      cards: deck.cards,
      cards_number: deck.cards.length
    }
  ]
  await database.update(DECK, deckParameters)
}
