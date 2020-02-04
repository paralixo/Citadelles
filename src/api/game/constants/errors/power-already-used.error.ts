import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const PowerAlreadyUsedError: IResponseData = {
  success: false,
  errorMessage: "Power already used"
};
