import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const PlayerDoesNotExistError: IResponseData = {
  success: false,
  errorMessage: "Player doesn't exist"
};
