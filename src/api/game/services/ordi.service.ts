import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface";
import request from "request-promise";
import { GAME_API_SERVER } from "@/api/game/constants/game.constants";
import { getPlayerOnName } from "./player.service";
import { PICK_MONEY, PICK_CARDS } from "../constants/rules.constants";

export const computerRogue = async (player:IPlayerData) => {
  await choiceBeginning(player);
};

export const choiceBeginning = async (player:IPlayerData) => {
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
      const labels : string[] = player.board.map(x => x.type.label);
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

export const buyDistrictOrNot = async (player:IPlayerData) => {
  const playerName : string = player.name;
  const minimumPrice: number = minimumPriceDistrictInHand(player);
  player = await getPlayerOnName(playerName);
  let tabPlayablesCardsIndex : any[] = [];

  if (player.money > minimumPrice) {
    player.hand.forEach(card => {
      if (player.money >= card.price) {
        tabPlayablesCardsIndex.push(player.hand.indexOf(card));
      }
    });

    if (player.board.length === 0) {
      await requestBuy(tabPlayablesCardsIndex[0], playerName);
    } else {
      console.log(tabPlayablesCardsIndex);
      const labelsOfCards: string[] = player.board.map(x => x.type.label);
      for (const indexPlayableCard of tabPlayablesCardsIndex) {
        let labelCard : string = player.hand[indexPlayableCard].type.label;
        if (!labelsOfCards.includes(labelCard)) {
          await requestBuy(indexPlayableCard, playerName);
          break;
        } else {
          await requestBuy(tabPlayablesCardsIndex[0], playerName);
          break;
        }
      }
    }
  } else {
    console.log("Not Enough Money");
  }
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
  let tabPriceDistrict : number[] = [];
  for (const card of player.hand) {
    tabPriceDistrict.push(card.price);
  }
  return tabPriceDistrict.sort()[0];
};

export const maximumPriceDistrictInHand = (player:IPlayerData) : number => {
  let tabPriceDistrict : number[] = [];
  for (const card of player.hand) {
    tabPriceDistrict.push(card.price);
  }
  return tabPriceDistrict.sort()[tabPriceDistrict.length + 1];
};

export const getRandomArbitrary = (max : number) => {
  return Math.random() * (max - 1) + 1;
};
