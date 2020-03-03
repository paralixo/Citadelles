import { IPlayerData } from "@/api/game/interfaces/models/PlayerData.interface"
import request from "request-promise"
import { GAME_API_SERVER } from "@/api/game/constants/game.constants"
import { getPlayerOnName } from "./player.service"
import { PICK_MONEY, PICK_CARDS } from "../constants/rules.constants"

export const computerRogue = async (player:IPlayerData) => {
  await choiceBeginning(player)
}

export const choiceBeginning = async (player:IPlayerData) => {
  const minimumPrice: number = minimumPriceDistrictInHand(player)
  const playerName : string = player.name
  const random : number = Math.random()
  const isEven : boolean = random % 2 === 0
  let choice: number = isEven ? 1 : 0

  if (player.money < minimumPrice) {
    await requestChoice(PICK_MONEY, playerName)
  } else {
    await requestChoice(PICK_CARDS, playerName)
    if (!player.board) {
      await requestDiscard(choice, playerName)
    } else {
      // @ts-ignore
      const labels : string[] = player.board.map(x => x.type.label)
      player = await getPlayerOnName(playerName)
      player.temporary_hand.forEach(async element => {
        if (labels.includes(element.type.label)) {
          choice = player.temporary_hand.indexOf(element)
        }
        await requestDiscard(choice, playerName)
      })
    }
  }
}

export const buyDistrictOrNot = async (player:IPlayerData) => {
  const playerName : string = player.name
  const minimumPrice: number = minimumPriceDistrictInHand(player)
  let random : number = getRandomArbitrary(player.hand.length)
  // Je crée un tableau imaginaire pour virer les cartes impossible à acheter
  // Et un tableau pour stocker les indexs ( c'est un peu ghetto mais bon j'ai pas trouvé mieux )
  // @ts-ignore
  let rest = []
  let index:number[] = []

  if (player.money > minimumPrice) {
    // 1ère étape je prépare ma main en enlevant les cartes inutiles que je ne peux pas acheter

    player.hand.forEach(card => {
      if (card.price < player.money) {
        // @ts-ignore
        rest.push(card)
        index.push(player.hand.indexOf(card))
      }
    })
    // @ts-ignore
    index.forEach(elem => {
      player.hand.splice(elem, 1)
    })

    /// //////////////////////////////////////////////////////////////////////////////////////////

    // 2ème étape Si le board est vide alors il joue juste une carte au hasard sinon condition
    if (!player.board) {
      await requestBuy(random, playerName)
    } else {
      // @ts-ignore
      const labels : string[] = player.board.map(x => x.type.label)
      player = await getPlayerOnName(playerName)
      player.hand.forEach(async element => {
        if (labels.includes(element.type.label)) {
          random = player.hand[maximumPriceDistrictInHand(player)]
        }
        await requestDiscard(random, playerName)
      })
    }
  }
  // On remet les cartes de la main temporaire dans la véritable main
  // @ts-ignore
  rest.forEach(elem => {
    player.hand.push(elem)
  })
}

const requestBuy = async (choice:number, playerName:String) => {
  await request.get({
    uri: `${GAME_API_SERVER}/player/${playerName}/buy/${choice}`,
    json: true
  })
}

const requestChoice = async (choice:number, playerName:string) => {
  await request.get({
    uri: `${GAME_API_SERVER}/player/${playerName}/choice/${choice}`,
    json: true
  })
}

const requestDiscard = async (choice:number, playerName:string) => {
  await request.get({
    uri: `${GAME_API_SERVER}/player/${playerName}/discard/${choice}`,
    json: true
  })
}

export const minimumPriceDistrictInHand = (player:IPlayerData) : number => {
  return player.hand.sort()[0].price
}

export const maximumPriceDistrictInHand = (player:IPlayerData) : number => {
  return player.hand.sort()[player.hand.length].price
}

export const getRandomArbitrary = (max : number) => {
  return Math.random() * (max - 1) + 1
}
