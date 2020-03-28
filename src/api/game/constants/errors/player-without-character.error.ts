import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const PlayerWithoutCharacterError: IResponseData = {
  success: false,
  errorMessage: "Player doesn't have a character"
};
