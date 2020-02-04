import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const CardDoesNotExistError: IResponseData = {
  success: false,
  errorMessage: "Card doesn't exist"
};
