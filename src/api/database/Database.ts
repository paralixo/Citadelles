import express from "express"

import { DATABASE_API_PORT } from "@/api/database/constants/database.constants"
import { IRouteModelMap } from "@/api/database/interfaces/RouteModelMap.interface"
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface"

import Character from "@/api/database/models/Character"
import Deck from "@/api/database/models/Deck"
import District from "@/api/database/models/District"
import Player from "@/api/database/models/Player"
import Type from "@/api/database/models/Type"

import "@/api/database/services/connection.service"
import { PATCH_CONDITION, PATCH_VALUE } from "@/api/database/constants/parameters.constants"

import "./services/generation.service"

const application = express()
application.use(express.json())

const routeModelMapping: IRouteModelMap[] = [
  { route: "/Character", model: Character },
  { route: "/Deck", model: Deck },
  { route: "/District", model: District },
  { route: "/Player", model: Player },
  { route: "/Type", model: Type }
]

async function getPromiseResponse (promise: Promise<any>): Promise<IResponseData> {
  let responseData: IResponseData = { success: false }

  await promise
    .then((document: any) => {
      responseData.success = true
      responseData.data = document
    })
    .catch((error: any) => {
      responseData.errorMessage = error
    })

  return responseData
}

routeModelMapping.forEach((object) => {
  application.post(object.route, async (request: any, response: any) => {
    const parameters: object = request.body
    // eslint-disable-next-line new-cap
    const createData: Promise<any> = new object.model(parameters).save()
    const responseData: IResponseData = await getPromiseResponse(createData)
    response.send(responseData)
  })

  application.get(object.route, async (request: any, response: any) => {
    const condition: object = request.body
    const readData: Promise<any> = object.model.find(condition)
    const responseData: IResponseData = await getPromiseResponse(readData)
    response.send(responseData)
  })

  application.patch(object.route, async (request: any, response: any) => {
    const condition: object = request.body[PATCH_CONDITION]
    const newValue: object = request.body[PATCH_VALUE]
    const updateData: Promise<any> = object.model.where(condition).updateMany(newValue)
    const responseData: IResponseData = await getPromiseResponse(updateData)
    response.send(responseData)
  })

  application.delete(object.route, async (request: any, response: any) => {
    const condition: object = request.body
    const deleteData: Promise<any> = object.model.deleteOne(condition)
    const responseData: IResponseData = await getPromiseResponse(deleteData)
    response.send(responseData)
  })
})

application.listen(DATABASE_API_PORT, () => {
  console.log(`Database API is listening on port ${DATABASE_API_PORT}`)
})

export default application
