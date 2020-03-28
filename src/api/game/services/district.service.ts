import { IDistrictCardData } from "@/api/game/interfaces/models/cards/DistrictCardData.interface";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import database from "@/api/game/services/database.service";
import { DISTRICT, PLAYER } from "@/api/database/constants/collections.constants";

export const getDistrictById = async (id: string): Promise<IDistrictCardData> => {
  const condition: {_id: string | null} = { _id: id === undefined ? null : id };
  const requestResult: IResponseData = await database.getAll(DISTRICT, condition);
  // @ts-ignore
  return requestResult.data[0];
};
