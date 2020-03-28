import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

export const PlayerIsNotTheRightCharacterError: IResponseData = {
  success: false,
  errorMessage: "Player isn't the right character"
};
