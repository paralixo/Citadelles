import database from "@/api/game/services/database.service";
import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface";
import { START_MONEY } from "@/api/game/constants/rules.constants";
import { PLAYER } from "@/api/database/constants/collections.constants";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import { IFieldValue } from "@/api/game/interfaces/FieldValue.interface";

export const generatePlayers = async (players: IPlayerData[]) => {
  for (const player of players) {
    player.money = START_MONEY;
    player.character_id = null;
    await database.create(PLAYER, player);
  }
};

export const getPlayerOnName = async (playerName: string): Promise<IPlayerData> => {
  const condition: {name: string} = { name: playerName };
  const requestResult: IResponseData = await database.getAll(PLAYER, condition);
  // @ts-ignore
  return requestResult.data[0];
};

export const getPlayerOnCharacter = async (characterName: string): Promise<IPlayerData> => {
  const requestResult: IResponseData = await database.getAll(PLAYER, { "character_id": { $exists: true, $ne: null } });
  // @ts-ignore
  if (!requestResult.data[0]) {
    // @ts-ignore
    return { success: false, message: "Les personnages n'ont pas été piochés" };
  }
  // @ts-ignore
  return requestResult.data.filter(player => player.character_id.name === characterName)[0];
};

export const updateFieldOfPlayer = async (playerName: string, field: string, value: any) => {
  const player: IPlayerData = await getPlayerOnName(playerName);
  const playerParameters: object[] = [
    { _id: player._id },
    { [field]: value }
  ];
  await database.update(PLAYER, playerParameters);
};

export const updateFieldsOfPlayer = async (playerName: string, fieldsAndValues: IFieldValue[]) => {
  const player: IPlayerData = await getPlayerOnName(playerName);
  let updateValue: any = {};
  fieldsAndValues.forEach((object: any) => {
    updateValue[object.field] = object.value;
  });
  const playerParameters: object[] = [
    { _id: player._id },
    updateValue
  ];
  await database.update(PLAYER, playerParameters);
};

export const isTargetable = async (targetedPlayer: IPlayerData): Promise<boolean> => {
  if (targetedPlayer.targetedBy !== "" || targetedPlayer.character_id.name === "Assassin") {
    return false;
  }
  return true;
};

export const getPointsFromDistricts = async (player: IPlayerData) => {
  let counter:number = 0;
  player.board.forEach(district => {
    if (district.name === "Université" || district.name === "Dracoport") {
      counter += district.price + 2;
    } else {
      counter += district.price;
    }
  });
  return counter;
};

export const getPointsFromColorsDistricts = async (player: IPlayerData) => {
  let points:number = 0;
  let isCourMiraclePresent : boolean = false;
  let typeDistrict = {
    trade: false,
    religion: false,
    military: false,
    noble: false,
    special: false
  };

  player.board.forEach(district => {
    if (district.type) {
      switch (district.type.label) {
        case "Commerce et artisanat" :
          typeDistrict.trade = true;
          break;
        case "Noblesse" :
          typeDistrict.noble = true;
          break;
        case "Religion" :
          typeDistrict.religion = true;
          break;
        case "Soldatesque" :
          typeDistrict.military = true;
          break;
        case "Prestige" :
          if (district.name === "Cour des miracles") {
            isCourMiraclePresent = true;
          } else {
            typeDistrict.special = true;
          }
          break;
      }
    }
  });
  let counter : number = 0;
  for (const type in typeDistrict) {
    // @ts-ignore
    if (typeDistrict[type] === true) {
      counter++;
    }
  }
  if (counter === 5 || (counter === 4 && isCourMiraclePresent)) {
    points += 3;
  }

  return points;
};

export const getPointsIfBoardSup8 = async (player: IPlayerData) => {
  let counter:number = 0;
  if (player.board.length >= 8) {
    counter += 2;
  }
  return counter;
};

export const getPointsIfFinishedFirst = async (player: IPlayerData) => {
  let counter:number = 0;
  if (player.isFinished) {
    counter += 4;
  }
  return counter;
};
