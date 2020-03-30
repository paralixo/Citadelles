import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { getOptions } from "@/views/services/request-options.service";
import request from "request-promise";

export async function computerChooseCharacter (player: any) {
  const options: IRequestOptions = getOptions(`/player/${player.name}/character/0`, {});
  await request.get(options);
}

export async function computerPlayTurn (player: any) {
  let options: IRequestOptions = getOptions(`/player/${player.name}/computer/choiceBeginning`, {});
  await request.get(options);
  options = getOptions(`/player/${player.name}/computer/buyDistrict`, {});
  await request.get(options);
}

export async function fetchCharacterName (cardsIds: string[]): Promise<any[]> {
  let characters: any[] = [];
  for (const cardId of cardsIds) {
    const options: IRequestOptions = getOptions("/Character", { _id: cardId }, true);
    let response: any = await request.get(options);
    characters.push(response.data[0]);
  }
  return characters;
}

export async function didSomeoneFinished (players: any[]): Promise<boolean> {
  for (const player of players) {
    const options: IRequestOptions = getOptions(`/player/${player.name}/victory`, {});
    const response: any = await request.get(options);
    if (response.success) {
      return true;
    }
  }
  return false;
}

export async function getScores (players: any[]): Promise<any[]> {
  let scores: any[] = [];
  for (const player of players) {
    const options: IRequestOptions = getOptions(`/player/${player.name}/countPoints`, {});
    const response: any = await request.get(options);
    const score: any = {
      playerName: player.name,
      points: response.success
    };
    scores.push(score);
  }
  // @ts-ignore
  return scores.sort((scoreA, scoreB) => scoreA.points > scoreB.points);
}

export function getIndex (playerSearched: any, players: any[]): number {
  for (const index in players) {
    const player = players[index];
    if (player._id === playerSearched._id) {
      // @ts-ignore
      return index;
    }
  }

  return 0;
}
