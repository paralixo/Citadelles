import express from "express"
import database from "@/api/game/services/database.service"
import { IGameParameters } from "@/api/game/interfaces/GameParameters.interface"
import { IPlayerData } from "@/api/game/interfaces/PlayerData.interface"
import { GAME_API_PORT } from "@/api/game/constants/game.constants"
import { CHARACTER, DECK, DISTRICT, PLAYER } from "@/api/database/constants/collections.constants"
import { PICK_CARDS, PICK_MONEY, START_MONEY } from "@/api/game/constants/rules.constants"
import { CHARACTER_TYPE, DISTRICT_TYPE } from "@/api/game/constants/deck.constants"
import { distributeCardsBetweenPlayers, draw, shuffle } from "@/api/game/services/deck.service"

const application = express()
application.use(express.json())

application.get("/initialize", async (request: any, response: any) => {
  // Clear old data
  // TODO: réctifier le delete de mongoose
  await database.clearAll(PLAYER)
  await database.clearAll(PLAYER)
  await database.clearAll(PLAYER)
  await database.clearAll(DECK)
  await database.clearAll(DECK)
  await database.clearAll(DECK)

  // Generate Players
  const gameParameters: IGameParameters = request.body
  const players: IPlayerData[] = gameParameters.players
  for (const player of players) {
    player.money = START_MONEY
    player.character_id = null
    await database.create(PLAYER, player)
  }

  // Generate Deck
  let districtCards = (await database.getAll(DISTRICT)).data
  districtCards = districtCards.map((card: any) => card._id)
  const districtDeckParamaters = {
    cards_number: districtCards.length,
    cards: shuffle(districtCards),
    type: DISTRICT_TYPE
  }
  const districtDeck = await database.create(DECK, districtDeckParamaters)

  let characterCards = (await database.getAll(CHARACTER)).data
  characterCards = characterCards.map((card: any) => card._id)
  const characterDeckParamaters = {
    cards_number: characterCards.length,
    cards: shuffle(characterCards),
    type: CHARACTER_TYPE
  }
  const characterDeck = await database.create(DECK, characterDeckParamaters)

  // Distribute cards
  distributeCardsBetweenPlayers()

  response.send({ success: true })
})

application.get("/player/:name/chooseCharacter/:position", async (request: any, response: any) => {
  const choosenCharacterPosition = request.params.position
  const playerName = request.params.name

  let characterDeck = (await database.getAll(DECK, { type: CHARACTER_TYPE })).data[0]
  const choosenCharacter = characterDeck.cards[choosenCharacterPosition]

  const player: any = (await database.getAll(PLAYER, { name: playerName })).data[0]

  const playerParameters = [
    { _id: player._id },
    { character_id: choosenCharacter }
  ]
  await database.update(PLAYER, playerParameters)
  characterDeck.cards.splice(choosenCharacter, 1)

  const characterDeckParameters = [
    { _id: characterDeck._id },
    {
      cards: characterDeck.cards,
      cards_number: characterDeck.cards.length
    }
  ]
  await database.update(DECK, characterDeckParameters)

  response.send({ success: true })
})

application.get("/player/:name/startChoice/:choice", async (request: any, response: any) => {
  const choice = parseInt(request.params.choice)
  const playerName = request.params.name
  const player: any = (await database.getAll(PLAYER, { name: playerName })).data[0]

  if (choice === PICK_MONEY) {
    const playerParameters = [
      { _id: player._id },
      { money: player.money + 3 }
    ]

    await database.update(PLAYER, playerParameters)
    response.send({ success: true })
  } else if (choice === PICK_CARDS) {
    let drawnCards = await draw(2)
    const playerParameters = [
      { _id: player._id },
      { temporary_hand: drawnCards }
    ]

    await database.update(PLAYER, playerParameters)
    response.send({ success: true })
  }

  response.send({ success: false })
})

application.get("/player/:name/discardTemporaryCard/:choice", async (request: any, response: any) => {
  const choice = parseInt(request.params.choice)
  const playerName = request.params.name
  const player: any = (await database.getAll(PLAYER, { name: playerName })).data[0]

  player.hand.push(player.temporary_hand[choice])

  const playerParameters = [
    { _id: player._id },
    {
      temporary_hand: [],
      hand: player.hand
    }
  ]
  await database.update(PLAYER, playerParameters)

  response.send({ success: true })
})

application.listen(GAME_API_PORT, () => {
  console.log(`Game API is listening on port ${GAME_API_PORT}`)
})

export default application
