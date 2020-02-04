import express from "express"
import database from "@/api/game/services/database.service"
import { IGameParameters } from "@/api/game/interfaces/GameParameters.interface"
import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface"
import { GAME_API_PORT } from "@/api/game/constants/game.constants"
import { DECK, PLAYER } from "@/api/database/constants/collections.constants"
import { PICK_CARDS, PICK_MONEY } from "@/api/game/constants/rules.constants"
import { CHARACTER_TYPE, DISTRICT_TYPE } from "@/api/game/constants/deck.constants"
import {
  discardFromDeck,
  distributeCardsBetweenPlayers,
  draw,
  generateDeck,
  getDeckByType
} from "@/api/game/services/deck.service"
import {
  generatePlayers,
  getPlayerOnName,
  updateFieldOfPlayer,
  updateFieldsOfPlayer
} from "@/api/game/services/player.service"
import { IDeckData } from "@/api/game/interfaces/models/DeckData.interface"
import { IDistrictCardData } from "@/api/game/interfaces/models/cards/DistrictCardData.interface"
import { getDistrictById } from "@/api/game/services/district.service"

const application = express()
application.use(express.json())

application.get("/initialize", async (request: any, response: any) => {
  await database.clearAll(PLAYER)
  await database.clearAll(DECK)

  const gameParameters: IGameParameters = request.body
  const players: IPlayerData[] = gameParameters.players
  await generatePlayers(players)

  await generateDeck(DISTRICT_TYPE)
  await generateDeck(CHARACTER_TYPE)
  await distributeCardsBetweenPlayers()

  response.send({ success: true })
})

application.get("/player/:name/character/:position", async (request: any, response: any) => {
  const playerName: string = request.params.name
  const chosenCharacterPosition: number = parseInt(request.params.position)

  const characterDeck: IDeckData = await getDeckByType(CHARACTER_TYPE)
  const chosenCharacterId: string = characterDeck.cards[chosenCharacterPosition]

  await updateFieldOfPlayer(playerName, "character_id", chosenCharacterId)
  await discardFromDeck(characterDeck, chosenCharacterId)

  response.send({ success: true })
})

application.get("/player/:name/choice/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name
  const choice: number = parseInt(request.params.choice)

  const player: IPlayerData = await getPlayerOnName(playerName)

  switch (choice) {
    case PICK_MONEY:
      await updateFieldOfPlayer(playerName, "money", player.money + 3)
      break
    case PICK_CARDS:
      const drawnCardsId: string[] = await draw(2)
      await updateFieldOfPlayer(playerName, "temporary_hand", drawnCardsId)
      break
  }

  response.send({ success: true })
})

application.get("/player/:name/discard/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name
  const choice: number = parseInt(request.params.choice)

  const player: IPlayerData = await getPlayerOnName(playerName)

  player.hand.push(player.temporary_hand[choice])
  await updateFieldsOfPlayer(playerName, [
    { field: "temporary_hand", value: [] },
    { field: "hand", value: player.hand }
  ])

  response.send({ success: true })
})

application.get("/player/:name/buy/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name
  const choice: number = parseInt(request.params.choice)

  const player: IPlayerData = await getPlayerOnName(playerName)
  if (!player) {
    response.send({ success: false })
    return
  }
  const buyedDistrict: IDistrictCardData = await getDistrictById(player.hand[choice])
  if (!buyedDistrict) {
    response.send({ success: false })
    return
  }

  player.money -= buyedDistrict.price
  if (player.money < 0) {
    response.send({ success: false })
    return
  }

  player.hand.splice(choice, 1)
  player.board.push(buyedDistrict._id)

  await updateFieldsOfPlayer(playerName, [
    { field: "hand", value: player.hand },
    { field: "board", value: player.board },
    { field: "money", value: player.money }
  ])

  response.send({ success: true })
})

application.listen(GAME_API_PORT, () => {
  console.log(`Game API is listening on port ${GAME_API_PORT}`)
})

export default application
