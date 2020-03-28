import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { GAME_API_SERVER } from "@/api/game/constants/game.constants";

export const getOptions = (route: string, body: any): IRequestOptions => {
  return {
    uri: GAME_API_SERVER + route,
    json: true,
    body
  };
};
