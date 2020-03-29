import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const CannotBeDestroyed: IResponseData = {
  success: false,
  errorMessage: "You can't destroy this district"
};
