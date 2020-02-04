import { ICardData } from "@/api/game/interfaces/models/cards/CardData.interface"

export interface IDistrictCardData extends ICardData {
  price: number;
  type: string;
}
