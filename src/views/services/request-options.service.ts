import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { GAME_API_SERVER } from "@/api/game/constants/game.constants";
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants";

export const getOptions = (route: string, body: any, isCallingDatabase: boolean = false): IRequestOptions => {
  const apiServer: string = isCallingDatabase ? DATABASE_API_SERVER : GAME_API_SERVER;
  return {
    uri: apiServer + route,
    json: true,
    body
  };
};
