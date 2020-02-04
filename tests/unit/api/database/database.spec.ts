import request from "request-promise";
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants";
import { CHARACTER, DECK, DISTRICT, PLAYER, TYPE } from "@/api/database/constants/collections.constants";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import { IRequestOptions } from "./interfaces/RequestOptions.interface";
import {
  CHARACTER_TEST_DATA,
  DECK_TEST_DATA,
  DISTRICT_TEST_DATA,
  PLAYER_TEST_DATA,
  TYPE_TEST_DATA
} from "./constants/testdata.constants";
import { DELETE_EXPECTED_RESPONSE, UPDATE_EXPECTED_RESPONSE } from "./constants/responses.constants";

describe("Database.ts", () => {
  const collections: string[] = [CHARACTER, DECK, DISTRICT, PLAYER, TYPE];

  const testDatas: object[] = [
    CHARACTER_TEST_DATA,
    DECK_TEST_DATA,
    DISTRICT_TEST_DATA,
    PLAYER_TEST_DATA,
    TYPE_TEST_DATA
  ];

  collections.forEach((collection: string, index: number) => {
    describe(collection, () => {
      let options: IRequestOptions = {
        uri: `${DATABASE_API_SERVER}/${collection}`,
        json: true,
        body: {}
      };

      it(`should create ${collection.toLowerCase()} from API`, async () => {
        options.body = testDatas[index];
        options.method = "POST";
        const responseData: IResponseData = await request(options);
        expect(responseData.success).toBeTruthy();
      });

      it(`should read ${collection.toLowerCase()} data from API`, async () => {
        options.body = {};
        options.method = "GET";
        const responseData: IResponseData = await request(options);
        expect(responseData.success).toBeTruthy();
      });

      it(`should update ${collection.toLowerCase()} data from API`, async () => {
        options.body = [testDatas[index], testDatas[index]];
        options.method = "PATCH";
        const responseData: IResponseData = await request(options);
        expect(responseData.success).toBeTruthy();
        expect(responseData.data).toEqual(UPDATE_EXPECTED_RESPONSE);
      });

      it(`should delete ${collection.toLowerCase()} from API`, async () => {
        options.body = testDatas[index];
        options.method = "DELETE";
        const responseData: IResponseData = await request(options);
        expect(responseData.success).toBeTruthy();
        expect(responseData.data).toEqual(DELETE_EXPECTED_RESPONSE);
      });
    });
  });
});
