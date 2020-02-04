import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const CharacterDoesNotExistError: IResponseData = {
  success: false,
  errorMessage: "Character doesn't exist"
};
