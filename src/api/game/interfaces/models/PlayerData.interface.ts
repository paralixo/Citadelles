export interface IPlayerData {
  _id: string;
  name: string;
  money: number;
  // eslint-disable-next-line camelcase
  character_id: any;
  hand: any[];
  // eslint-disable-next-line camelcase
  temporary_hand: any[];
  isFinished: boolean;
  targetedBy: string;
  buyedDistricts: number;
  board: any[];
}
