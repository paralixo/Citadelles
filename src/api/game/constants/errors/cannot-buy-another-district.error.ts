import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const CannotBuyAnotherDistrictError: IResponseData = {
  success: false,
  errorMessage: "Can't buy another district"
};
