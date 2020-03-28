import express from "express";
import database from "@/api/game/services/database.service";
import { IGameParameters } from "@/api/game/interfaces/GameParameters.interface";
import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface";
import { GAME_API_PORT } from "@/api/game/constants/game.constants";
import { DECK, PLAYER } from "@/api/database/constants/collections.constants";
import {
  MAGICIAN_DISCARD_AND_DRAW,
  MAGICIAN_SWITCH_HANDS, MAX_BUYABLE_DISTRICTS, MAX_BUYABLE_DISTRICTS_AS_ARCHITECT, NUMBER_OF_DISTRICTS_TO_WIN,
  PICK_CARDS,
  PICK_MONEY
} from "@/api/game/constants/rules.constants";
import { CHARACTER_TYPE, DISTRICT_TYPE } from "@/api/game/constants/deck.constants";
import {
  discardFromDeck,
  distributeCardsBetweenPlayers,
  draw,
  generateDeck,
  getDeckByType
} from "@/api/game/services/deck.service";
import {
  generatePlayers,
  getPlayerOnName,
  updateFieldOfPlayer,
  updateFieldsOfPlayer,
  getPointsFromColorsDistricts,
  getPointsFromDistricts,
  getPointsIfBoardSup8,
  getPointsIfFinishedFirst
} from "@/api/game/services/player.service";
import { IDeckData } from "@/api/game/interfaces/models/DeckData.interface";
import { IDistrictCardData } from "@/api/game/interfaces/models/cards/DistrictCardData.interface";
import { getDistrictById } from "@/api/game/services/district.service";
import { ICharacterCardData } from "@/api/game/interfaces/models/cards/CharacterCardData.interface";
import {
  condottieriDestroyDistrict,
  getCharacterById, magicianDiscardAndDraw,
  magicianSwitchHands,
  startTurnEffects,
  stolenByThief
} from "@/api/game/services/character.service";
import {
  ARCHITECT,
  ASSASSIN,
  BISHOP,
  CONDOTTIERI,
  MAGICIAN,
  THIEF
} from "@/api/game/constants/character.constant";
import { PlayerDoesNotExistError } from "@/api/game/constants/errors/player-does-not-exist.error";
import { CharacterDoesNotExistError } from "@/api/game/constants/errors/character-does-not-exist.error";
import { PlayerWithoutCharacterError } from "@/api/game/constants/errors/player-without-character.error";
import { InvalidTargetError } from "@/api/game/constants/errors/invalid-target.error";
import { InvalidChoiceError } from "@/api/game/constants/errors/invalid-choice.error";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import { NotEnoughtMoneyError } from "@/api/game/constants/errors/not-enougth-money.error";
import { CardDoesNotExistError } from "@/api/game/constants/errors/card-does-not-exist.error";
import { PlayerIsNotTheRightCharacterError } from "@/api/game/constants/errors/player-is-not-the-right-character.error";
import { PowerAlreadyUsedError } from "@/api/game/constants/errors/power-already-used.error";
import { CannotBuyAnotherDistrictError } from "@/api/game/constants/errors/cannot-buy-another-district.error";

const application = express();
application.use(express.json());

application.get("/initialize", async (request: any, response: any) => {
  await database.clearAll(PLAYER);
  await database.clearAll(DECK);

  const gameParameters: IGameParameters = request.body;
  const players: IPlayerData[] = gameParameters.players;
  await generatePlayers(players);

  await generateDeck(DISTRICT_TYPE);
  await generateDeck(CHARACTER_TYPE);
  await distributeCardsBetweenPlayers();

  response.send({ success: true });
});

application.get("/player/:name/character/:position", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const chosenCharacterPosition: number = parseInt(request.params.position);

  const characterDeck: IDeckData = await getDeckByType(CHARACTER_TYPE);
  const characterId: string = characterDeck.cards[chosenCharacterPosition];
  const character: ICharacterCardData = await getCharacterById(characterId);

  await updateFieldOfPlayer(playerName, "character_id", character._id);
  await discardFromDeck(characterDeck, character._id);

  response.send({ success: true, data: character.name });
});

application.get("/player/:name/choice/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const choice: number = parseInt(request.params.choice);

  const player: IPlayerData = await getPlayerOnName(playerName);

  switch (choice) {
    case PICK_MONEY:
      await updateFieldOfPlayer(playerName, "money", player.money + 3);
      break;
    case PICK_CARDS:
      const drawnCardsId: string[] = await draw(2);
      await updateFieldOfPlayer(playerName, "temporary_hand", drawnCardsId);
      break;
  }

  response.send({ success: true });
});

application.get("/player/:name/discard/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const choice: number = parseInt(request.params.choice);

  const player: IPlayerData = await getPlayerOnName(playerName);

  player.hand.push(player.temporary_hand[choice]);
  await updateFieldsOfPlayer(playerName, [
    { field: "temporary_hand", value: [] },
    { field: "hand", value: player.hand }
  ]);

  response.send({ success: true });
});

application.get("/player/:name/buy/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const choice: number = parseInt(request.params.choice);

  const player: IPlayerData = await getPlayerOnName(playerName);
  if (!player) {
    response.send(PlayerDoesNotExistError);
    return;
  }
  const character: ICharacterCardData = await getCharacterById(player.character_id);
  if (!character) {
    response.send(CharacterDoesNotExistError);
    return;
  }
  const isArchitect: boolean = character.name === ARCHITECT;
  if ((!isArchitect && player.buyedDistricts === MAX_BUYABLE_DISTRICTS) ||
    (isArchitect && player.buyedDistricts === MAX_BUYABLE_DISTRICTS_AS_ARCHITECT)) {
    response.send(CannotBuyAnotherDistrictError);
    return;
  }
  const buyedDistrict: IDistrictCardData = await getDistrictById(player.hand[choice]);
  if (!buyedDistrict) {
    response.send(CardDoesNotExistError);
    return;
  }

  player.money -= buyedDistrict.price;
  if (player.money < 0) {
    response.send(NotEnoughtMoneyError);
    return;
  }

  player.hand.splice(choice, 1);
  player.board.push(buyedDistrict._id);
  player.buyedDistricts++;

  await updateFieldsOfPlayer(playerName, [
    { field: "hand", value: player.hand },
    { field: "board", value: player.board },
    { field: "money", value: player.money },
    { field: "buyedDistricts", value: player.buyedDistricts }
  ]);

  response.send({ success: true });
});

application.get("/player/:name/startTurn", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  let player: IPlayerData = await getPlayerOnName(playerName);
  if (!player) {
    response.send(PlayerDoesNotExistError);
    return;
  }

  const playerHasBeenTargeted: boolean = player.targetedBy !== "";
  if (playerHasBeenTargeted) {
    await updateFieldOfPlayer(player.name, "targetedBy", "");
    switch (player.targetedBy) {
      case ASSASSIN:
        response.send({ success: true, message: "Le tour du joueur est passé (assassiné)" });
        break;
      case THIEF:
        player = await stolenByThief(player);
        break;
      case MAGICIAN:
        break;
      default:
        response.send(CharacterDoesNotExistError);
        break;
    }
  }

  const character: ICharacterCardData = await getCharacterById(player.character_id);
  if (!character) {
    response.send(PlayerWithoutCharacterError);
    return;
  }

  const returnValue = await startTurnEffects(character, request, player);
  response.send(returnValue);
});

application.get("/player/:name/magician/:choice", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const playerChoice: number = parseInt(request.params.choice);

  let player: IPlayerData = await getPlayerOnName(playerName);
  if (!player) {
    response.send(PlayerDoesNotExistError);
    return;
  }

  const character: ICharacterCardData = await getCharacterById(player.character_id);
  if (!character) {
    response.send(PlayerWithoutCharacterError);
    return;
  } else if (character.name !== MAGICIAN) {
    response.send(PlayerIsNotTheRightCharacterError);
    return;
  }

  const playerAlreadyUsedPower: boolean = player.targetedBy === MAGICIAN;
  if (playerAlreadyUsedPower) {
    response.send(PowerAlreadyUsedError);
    return;
  }

  let success: IResponseData;
  switch (playerChoice) {
    case MAGICIAN_SWITCH_HANDS:
      const targetName: string = request.body.target;
      const targetedPlayer: IPlayerData = await getPlayerOnName(targetName);
      success = await magicianSwitchHands(targetedPlayer, player);
      break;
    case MAGICIAN_DISCARD_AND_DRAW:
      const cardIndexesToDiscard: number[] = request.body.cards;
      success = await magicianDiscardAndDraw(player, cardIndexesToDiscard);
      break;
    default:
      return response.send(InvalidChoiceError);
  }
  response.send(success);
});

application.get("/player/:name/condottieri", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const targetName: string = request.body.target;
  const districtToDestroy: number = request.body.district;

  let player: IPlayerData = await getPlayerOnName(playerName);
  if (!player) {
    response.send(PlayerDoesNotExistError);
    return;
  }

  const character: ICharacterCardData = await getCharacterById(player.character_id);
  if (!character) {
    response.send(PlayerWithoutCharacterError);
    return;
  } else if (character.name !== CONDOTTIERI) {
    response.send(PlayerIsNotTheRightCharacterError);
    return;
  }

  const playerAlreadyUsedPower: boolean = player.targetedBy === CONDOTTIERI;
  if (playerAlreadyUsedPower) {
    response.send(PowerAlreadyUsedError);
    return;
  }

  let targetedPlayer: IPlayerData = await getPlayerOnName(targetName);
  if (!targetedPlayer) {
    response.send(InvalidTargetError);
    return;
  }

  const targetedPlayerCharacter: ICharacterCardData = await getCharacterById(targetedPlayer.character_id);
  if (targetedPlayerCharacter.name === BISHOP) {
    response.send(InvalidTargetError);
    return;
  }

  if (targetedPlayer.board.length <= districtToDestroy) {
    response.send(InvalidChoiceError);
    return;
  }

  const success: IResponseData = await condottieriDestroyDistrict(player, targetedPlayer, districtToDestroy);
  response.send(success);
});

application.get("/player/:name/victory", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const player: IPlayerData = await getPlayerOnName(playerName);
  let victory: boolean = false;

  if (player.board.length === NUMBER_OF_DISTRICTS_TO_WIN) {
    victory = true;
    await updateFieldOfPlayer(playerName, "isFinished", true);
  }
  response.send({
    success: victory
  });
});

application.get("/player/:name/countPoints", async (request: any, response: any) => {
  const playerName: string = request.params.name;
  const player: IPlayerData = await getPlayerOnName(playerName);
  let points = await getPointsFromColorsDistricts(player) + await getPointsFromDistricts(player) + await getPointsIfBoardSup8(player) + await getPointsIfFinishedFirst(player);
  response.send({
    success: points
  });
});

application.listen(GAME_API_PORT, () => {
  console.log(`Game API is listening on port ${GAME_API_PORT}`);
});

export default application;
