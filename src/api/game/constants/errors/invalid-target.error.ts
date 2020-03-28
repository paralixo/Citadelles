import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const InvalidTargetError: IResponseData = {
  success: false,
  errorMessage: "Invalid target"
};
