import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const NotEnoughtMoneyError: IResponseData = {
  success: false,
  errorMessage: "Player doen't have enought money"
};
