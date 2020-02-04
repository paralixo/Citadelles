import database from "@/api/game/services/database.service"
import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface"
import { START_MONEY } from "@/api/game/constants/rules.constants"
import { PLAYER } from "@/api/database/constants/collections.constants"
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface"
import { IFieldValue } from "@/api/game/interfaces/FieldValue.interface"

export const generatePlayers = async (players: IPlayerData[]) => {
  for (const player of players) {
    player.money = START_MONEY
    player.character_id = null
    await database.create(PLAYER, player)
  }
}

export const getPlayerOnName = async (playerName: string): Promise<IPlayerData> => {
  const condition: {name: string} = { name: playerName }
  const requestResult: IResponseData = await database.getAll(PLAYER, condition)
  // @ts-ignore
  return requestResult.data[0]
}

export const updateFieldOfPlayer = async (playerName: string, field: string, value: any) => {
  const player: IPlayerData = await getPlayerOnName(playerName)
  const playerParameters: object[] = [
    { _id: player._id },
    { [field]: value }
  ]
  await database.update(PLAYER, playerParameters)
}

export const updateFieldsOfPlayer = async (playerName: string, fieldsAndValues: IFieldValue[]) => {
  const player: IPlayerData = await getPlayerOnName(playerName)
  let updateValue: any = {}
  fieldsAndValues.forEach((object: any) => {
    updateValue[object.field] = object.value
  })
  const playerParameters: object[] = [
    { _id: player._id },
    updateValue
  ]
  await database.update(PLAYER, playerParameters)
}
