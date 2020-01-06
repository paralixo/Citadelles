import request from "request-promise"
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants"
import { BOARD, CHARACTER, DECK, DISTRICT, PLAYER, TYPE } from "@/api/database/constants/collections.constants"
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface"
import { IRequestOptions } from "./interfaces/RequestOptions.interface"

describe("Database.ts", () => {
  const collections: string[] = [BOARD, CHARACTER, DECK, DISTRICT, PLAYER, TYPE]

  const testDatas: object[] = [
    {},
    {},
    {},
    {
      name: "District : test unitaire",
      image: "district.jpg",
      description: "donnée de test",
      price: 3,
      type: "5dcf4b5fc8391f3d98e9d4b7"
    },
    {},
    {}
  ]

  collections.forEach((collection: string) => {
    describe(collection, () => {
      let options: IRequestOptions = {
        uri: `${DATABASE_API_SERVER}/${collection}`,
        json: true,
        body: {}
      }
      if (collection === "District") {
        it(`should create ${collection.toLowerCase()} from API`, async () => {
          options.body = testDatas[3]
          options.method = "POST"
          const responseData: IResponseData = await request(options)
          expect(responseData.success).toBeTruthy()
        })
      }

      it(`should read ${collection.toLowerCase()} data from API`, async () => {
        options.body = {}
        options.method = "GET"
        const responseData: IResponseData = await request(options)
        expect(responseData.success).toBeTruthy()
      })

      it(`should delete ${collection.toLowerCase()} from API`, async () => {
        const responseData: IResponseData = await request(options)
        expect(responseData.success).toBeTruthy()
      })
    })
  })
})
