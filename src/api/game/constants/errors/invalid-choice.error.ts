import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const InvalidChoiceError: IResponseData = {
  success: false,
  errorMessage: "Invalid choice"
};
