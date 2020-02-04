import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const InvalidNumberOfCardsError: IResponseData = {
  success: false,
  errorMessage: "Invalid number of cards"
};
