import { IDistrictCardData } from "@/api/game/interfaces/models/cards/DistrictCardData.interface";

export interface IStatus {
  name: string;
  money: number;
  cardsInHand: number;
  character: string;
  board: IDistrictCardData[]
}
