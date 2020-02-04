import request from "request-promise"
import { IRequestOptions } from "../database/interfaces/RequestOptions.interface"
import { GAME_API_SERVER } from "@/api/game/constants/game.constants"
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface"
import { INITIALIZE_BODY } from "./mocks/initialize.mock"
import { EMPTY_BODY } from "./mocks/emptyBody.mock"
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants"

describe("Game.ts", () => {
  let options: IRequestOptions = {
    uri: "",
    json: true,
    body: {}
  }

  it("should be able to initialize the game", async () => {
    options.uri = `${GAME_API_SERVER}/initialize`
    options.body = INITIALIZE_BODY

    const responseData: IResponseData = await request(options)
    expect(responseData.success).toBeTruthy()
  })

  it("should be able to pick a character for a player", async () => {
    options.uri = `${GAME_API_SERVER}/player/toto/character/0`
    options.body = EMPTY_BODY

    const responseData: IResponseData = await request(options)
    expect(responseData.success).toBeTruthy()
  })

  it("should be able to make a choice at the beginning of the turn", async () => {
    options.uri = `${GAME_API_SERVER}/player/toto/choice/1`
    options.body = EMPTY_BODY

    const responseData: IResponseData = await request(options)
    expect(responseData.success).toBeTruthy()
  })

  it("should be able to discard a card when player choose to draw at the beginning of the turn", async () => {
    options.uri = `${GAME_API_SERVER}/player/toto/discard/0`
    options.body = EMPTY_BODY

    const responseData: IResponseData = await request(options)
    expect(responseData.success).toBeTruthy()
  })

  it("should buy the selected district in hand", async () => {
    // TODO: refacto
    options.uri = `${DATABASE_API_SERVER}/Player`
    options.body = {
      name: "test_player",
      money: 10,
      card: []
    }
    await request.post(options)
    options.uri = `${GAME_API_SERVER}/player/test_player/choice/1`
    await request(options)
    options.uri = `${GAME_API_SERVER}/player/test_player/discard/1`
    await request(options)

    options.uri = `${GAME_API_SERVER}/player/test_player/buy/0`
    options.body = EMPTY_BODY

    const responseData: IResponseData = await request(options)

    options.uri = `${DATABASE_API_SERVER}/Player`
    options.body = {
      name: "test_player"
    }
    await request.delete(options)
    expect(responseData.success).toBeTruthy()
  })

  it("should return an error because the card doesn't exist on selected player", async () => {
    // TODO: refacto
    options.uri = `${DATABASE_API_SERVER}/Player`
    options.body = {
      name: "test_player",
      money: 10
    }
    await request.post(options)

    options.uri = `${GAME_API_SERVER}/player/test_player/buy/0`
    options.body = EMPTY_BODY

    const responseData: IResponseData = await request(options)

    options.uri = `${DATABASE_API_SERVER}/Player`
    options.body = {
      name: "test_player"
    }
    await request.delete(options)
    expect(responseData.success).toBeFalsy()
  })
})
