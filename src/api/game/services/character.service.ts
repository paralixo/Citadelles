import { ICharacterCardData } from "@/api/game/interfaces/models/cards/CharacterCardData.interface";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import database from "@/api/game/services/database.service";
import { CHARACTER } from "@/api/database/constants/collections.constants";
import {
  ARCHITECT,
  ASSASSIN,
  BISHOP,
  CONDOTTIERI,
  KING,
  MAGICIAN,
  THIEF,
  TRADER
} from "@/api/game/constants/character.constant";
import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface";
import { getPlayerOnCharacter, isTargetable, updateFieldOfPlayer } from "@/api/game/services/player.service";
import { draw } from "@/api/game/services/deck.service";
import { InvalidTargetError } from "@/api/game/constants/errors/invalid-target.error";
import { PlayerDoesNotExistError } from "@/api/game/constants/errors/player-does-not-exist.error";
import { InvalidNumberOfCardsError } from "@/api/game/constants/errors/invalid-number-of-cards.error";
import { ICardData } from "@/api/game/interfaces/models/cards/CardData.interface";
import { IDistrictCardData } from "@/api/game/interfaces/models/cards/DistrictCardData.interface";
import { NotEnoughtMoneyError } from "@/api/game/constants/errors/not-enougth-money.error";
import { CannotBeDestroyed } from "@/api/game/constants/errors/cannot-be-destroyed";

export const getCharacterById = async (id: string): Promise<ICharacterCardData> => {
  const condition: { _id: string | null } = { _id: id === undefined ? null : id };
  const requestResult: IResponseData = await database.getAll(CHARACTER, condition);
  // @ts-ignore
  return requestResult.data[0];
};

export const startTurnEffects = async (character: ICharacterCardData, request: any, player: IPlayerData) => {
  const playerName: string = player.name;
  let isMagicSchool : boolean = false;
  for (const card of player.board) {
    if (card.name === "Ecole de magie") {
      isMagicSchool = true;
    }
  }
  switch (character.name) {
    case ASSASSIN:
      let targetedCharacter: string = request.body.target;
      if (!targetedCharacter) {
        return InvalidTargetError;
      }
      let targetedPlayer: IPlayerData = await getPlayerOnCharacter(targetedCharacter);
      if (targetedPlayer !== undefined && isTargetable(targetedPlayer)) {
        await updateFieldOfPlayer(targetedPlayer.name, "targetedBy", "Assassin");
      }
      break;
    case THIEF:
      targetedCharacter = request.body.target;
      if (!targetedCharacter) {
        return InvalidTargetError;
      }
      targetedPlayer = await getPlayerOnCharacter(targetedCharacter);
      if (targetedPlayer !== undefined && isTargetable(targetedPlayer)) {
        await updateFieldOfPlayer(targetedPlayer.name, "targetedBy", "Voleur");
      }
      break;
    case KING:
      // TODO: recoit la carte 'couronne'
      const areNobleDistricts: boolean[] = player.board.map(district => {
        return district.type.label === "Noblesse" || isMagicSchool;
      });
      const numberOfNobleDistricts: number = areNobleDistricts.filter(Boolean).length;
      await updateFieldOfPlayer(playerName, "money", player.money + numberOfNobleDistricts);
      break;
    case BISHOP:
      const areReligiousDistricts: boolean[] = player.board.map(district => district.type.label === "Religion" || isMagicSchool);
      const numberOfReligiousDistricts: number = areReligiousDistricts.filter(Boolean).length;
      await updateFieldOfPlayer(playerName, "money", player.money + numberOfReligiousDistricts);
      break;
    case TRADER:
      const areCommercialDistricts: boolean[] = player.board.map(district => district.type.label === "Commerce et artisanat" || isMagicSchool);
      const numberOfCommercialDistricts: number = areCommercialDistricts.filter(Boolean).length;
      await updateFieldOfPlayer(playerName, "money", ++player.money + numberOfCommercialDistricts);
      break;
    case ARCHITECT:
      const drawedCards: string[] = await draw(2);
      drawedCards.forEach((card) => {
        player.hand.push(card);
      });
      updateFieldOfPlayer(playerName, "hand", player.hand);
      break;
    case CONDOTTIERI:
      const areMilitaryDistricts: boolean[] = player.board.map(district => district.type.label === "Soldatesque" || isMagicSchool);
      const numberOfMilitaryDistricts: number = areMilitaryDistricts.filter(Boolean).length;
      await updateFieldOfPlayer(playerName, "money", player.money + numberOfMilitaryDistricts);
      break;
    default:
      return PlayerDoesNotExistError;
  }

  return { success: true };
};

export const stolenByThief = async (player: IPlayerData): Promise<IPlayerData> => {
  const thief: IPlayerData = await getPlayerOnCharacter(THIEF);
  await updateFieldOfPlayer(thief.name, "money", thief.money + player.money);
  player.money = 0;
  await updateFieldOfPlayer(player.name, "money", player.money);
  return player;
};

export const magicianSwitchHands = async (targetedPlayer: IPlayerData, player: IPlayerData): Promise<IResponseData> => {
  if (!targetedPlayer) {
    return InvalidTargetError;
  } else if (!player) {
    return PlayerDoesNotExistError;
  }

  await updateFieldOfPlayer(targetedPlayer.name, "hand", player.hand);
  await updateFieldOfPlayer(player.name, "hand", targetedPlayer.hand);
  await updateFieldOfPlayer(player.name, "targetedBy", MAGICIAN);
  return { success: true };
};

export const magicianDiscardAndDraw = async (player: IPlayerData, cardIndexesToDiscard: number[]): Promise<IResponseData> => {
  if (!player) {
    return PlayerDoesNotExistError;
  } else if (!cardIndexesToDiscard || cardIndexesToDiscard.length > player.hand.length) {
    return InvalidNumberOfCardsError;
  }

  const numberOfCardsDiscarded: number = cardIndexesToDiscard.length;

  let playerHand: string[] = [];
  let discardedCards: ICardData[] = [];
  for (let index = 0; index < player.hand.length; index++) {
    const card: ICardData = player.hand[index];
    if (cardIndexesToDiscard.includes(index)) {
      discardedCards.push(card);
    } else {
      playerHand.push(card._id);
    }
  }

  const drawedCards: string[] = await draw(numberOfCardsDiscarded);
  for (let index = 0; index < numberOfCardsDiscarded; index++) {
    playerHand.push(drawedCards[index]);
  }
  await updateFieldOfPlayer(player.name, "hand", playerHand);
  // TODO: cartes défaussés sous la pioche
  await updateFieldOfPlayer(player.name, "targetedBy", MAGICIAN);
  return { success: true, data: [playerHand] };
};

export const condottieriDestroyDistrict = async (player: IPlayerData, targetedPlayer: IPlayerData, districtToDestroy: number): Promise<IResponseData> => {
  const destroyedDistrict: IDistrictCardData = targetedPlayer.board.splice(districtToDestroy, 1)[0];
  if (destroyedDistrict.price > player.money) {
    return NotEnoughtMoneyError;
  }
  if (destroyedDistrict.name === "Donjon") {
    return CannotBeDestroyed;
  }
  await updateFieldOfPlayer(targetedPlayer.name, "board", targetedPlayer.board);
  await updateFieldOfPlayer(player.name, "targetedBy", CONDOTTIERI);
  await updateFieldOfPlayer(player.name, "money", player.money - destroyedDistrict.price);
  return { success: true, data: [destroyedDistrict] };
};
