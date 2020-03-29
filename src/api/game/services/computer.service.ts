import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface";
import request from "request-promise";
import { GAME_API_SERVER } from "@/api/game/constants/game.constants";
import { getPlayerOnName } from "./player.service";
import { PICK_MONEY, PICK_CARDS } from "../constants/rules.constants";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import { NotEnoughtMoneyError } from "@/api/game/constants/errors/not-enougth-money.error";

export const beginningChoice = async (player:IPlayerData) => {
  const minimumPrice: number = minimumPriceDistrictInHand(player);
  const playerName : string = player.name;
  const random : number = Math.random();
  const isEven : boolean = random % 2 === 0;
  let choice: number = isEven ? 1 : 0;

  if (player.money < minimumPrice) {
    await requestChoice(PICK_MONEY, playerName);
  } else {
    await requestChoice(PICK_CARDS, playerName);
    if (!player.board) {
      await requestDiscard(choice, playerName);
    } else {
      const labels : string[] = player.board.map(card => card.type.label);
      player = await getPlayerOnName(playerName);
      for (const element of player.temporary_hand) {
        if (labels.includes(element.type.label)) {
          choice = player.temporary_hand.indexOf(element);
        }
        await requestDiscard(choice, playerName);
      }
    }
  }
};

export const buyDistrictOrNot = async (player:IPlayerData) : Promise<IResponseData> => {
  const playerName : string = player.name;
  const minimumPrice: number = minimumPriceDistrictInHand(player);
  player = await getPlayerOnName(playerName);
  let playableCardsIndexes : number[] = [];

  if (player.money > minimumPrice) {
    player.hand.forEach(card => {
      if (player.money >= card.price) {
        playableCardsIndexes.push(player.hand.indexOf(card));
      }
    });

    if (player.board.length === 0) {
      await requestBuy(playableCardsIndexes[0], playerName);
    } else {
      const labelsOfCards: string[] = player.board.map(card => card.type.label);
      for (const indexPlayableCard of playableCardsIndexes) {
        let labelCard : string = player.hand[indexPlayableCard].type.label;
        if (!labelsOfCards.includes(labelCard)) {
          await requestBuy(indexPlayableCard, playerName);
          break;
        } else {
          await requestBuy(playableCardsIndexes[0], playerName);
          break;
        }
      }
    }
  } else {
    return NotEnoughtMoneyError;
  }
  return {
    success: true
  };
};

const requestBuy = async (choice:number, playerName:String) => {
  await request.get({
    uri: `${GAME_API_SERVER}/player/${playerName}/buy/${choice}`,
    json: true
  });
};

const requestChoice = async (choice:number, playerName:string) => {
  await request.get({
    uri: `${GAME_API_SERVER}/player/${playerName}/choice/${choice}`,
    json: true
  });
};

const requestDiscard = async (choice:number, playerName:string) => {
  await request.get({
    uri: `${GAME_API_SERVER}/player/${playerName}/discard/${choice}`,
    json: true
  });
};

export const minimumPriceDistrictInHand = (player:IPlayerData) : number => {
  let priceDistrict : number[] = [];
  for (const card of player.hand) {
    priceDistrict.push(card.price);
  }
  return priceDistrict.sort()[0];
};

export const maximumPriceDistrictInHand = (player:IPlayerData) : number => {
  let priceDistrict : number[] = [];
  for (const card of player.hand) {
    priceDistrict.push(card.price);
  }
  return priceDistrict.sort()[priceDistrict.length + 1];
};

export const getRandomArbitrary = (max : number) => {
  return Math.random() * (max - 1) + 1;
};
