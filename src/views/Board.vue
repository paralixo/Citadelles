<template>
  <div>
    <StatusManager v-model="players" @show-playground="switchPlayground" :showCharacterName="playersCharacters"/>
    <MenuButton href="#/gameConfiguration">Quitter</MenuButton>
    <MenuButton @click="endTurn">Tour suivant</MenuButton>
    <Playground v-model="currentPlayer" @buy="refresh"/>
    <CharacterPickerDialog v-if="renderCharacterDialog" v-model="characterDeck" :current-player-name="players[0].name" @select="characterIsSelected"/>
    <StartTurnDialog v-if="renderStartTurnDialog" v-model="players[0]" @draw="refresh" @choice-over="startChoiceIsOver"/>
    <TargetDialog ref="target" v-if="renderTargetDialog" @select="selectATarget"/>
    <ScoreDialog v-if="renderScoreDialog" v-model="scores"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Playground from "@/components/playground/Playground.vue";
import MenuButton from "@/components/gui/MenuButton.vue";
import { getOptions } from "@/views/services/request-options.service";
import { IRequestOptions } from "../../tests/unit/api/database/interfaces/RequestOptions.interface";
import request from "request-promise";
import StatusManager from "@/components/status/StatusManager.vue";
import CharacterPickerDialog from "@/components/character/CharacterPickerDialog.vue";
import StartTurnDialog from "@/components/gui/StartTurnDialog.vue";
import TargetDialog from "@/components/character/TargetDialog.vue";
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
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import {
  computerChooseCharacter,
  computerPlayTurn,
  didSomeoneFinished,
  fetchCharacterName, getIndex, getScores
} from "@/views/services/board.service";
import ScoreDialog from "@/components/gui/ScoreDialog.vue";

@Component({
  components: { ScoreDialog, TargetDialog, Playground, MenuButton, StatusManager, CharacterPickerDialog, StartTurnDialog }
})
export default class Board extends Vue {
  public players: any[] = [];
  public playersCharacters: any[] = [];
  public currentPlayer: any = {};
  public characterDeck: any[] = [];
  public renderCharacterDialog: boolean = false;
  public renderStartTurnDialog: boolean = false;
  public renderTargetDialog: boolean = false;
  public renderScoreDialog: boolean = false;
  public unpassedRoundPlayers: any[] = [];
  public isGameOver: boolean = false;
  public scores: any[] = [];

  async mounted () {
    await this.fetchPlayers();
    this.switchPlayground(this.players[0].name);
    await this.startCharacterRoundTable();
  }

  public async refresh () {
    await this.fetchPlayers();
    this.switchPlayground(this.currentPlayer.name);
  }

  public async fetchPlayers () {
    const options: IRequestOptions = getOptions("/Player", {}, true);
    const response: IResponseData = await request.get(options);
    this.players = response.data as any;
  }

  public switchPlayground (playerName: string) {
    this.currentPlayer = this.players.find(player => player.name === playerName);
  }

  public async generateCharacterDeck () {
    const options: IRequestOptions = getOptions("/generateCharacters", {});
    await request.get(options);
    await this.fetchCharacterDeck();
  }

  public async fetchCharacterDeck () {
    const options: IRequestOptions = getOptions("/Deck", { type: "character" }, true);
    const response: any = await request.get(options);
    this.characterDeck = await fetchCharacterName(response.data[0].cards);
  }

  public async startCharacterRoundTable () {
    await this.generateCharacterDeck();
    this.unpassedRoundPlayers = JSON.parse(JSON.stringify(this.players));
    // TODO: first to choose has the crow
    for (const player of this.players) {
      this.unpassedRoundPlayers.shift();
      await this.refresh();
      if (player.isHuman) {
        this.renderCharacterDialog = true;
        return;
      } else {
        await computerChooseCharacter(player);
      }
    }
  }

  public async continueCharacterRoundTable () {
    for (const player of this.unpassedRoundPlayers) {
      await computerChooseCharacter(player);
    }
    await this.refresh();
  }

  public async characterIsSelected () {
    this.renderCharacterDialog = false;
    await this.continueCharacterRoundTable();
    await this.refresh();
    await this.startGameRoundTable();
  }

  public async startGameRoundTable () {
    this.playersCharacters = [];
    let orderedPlayers: any[] = JSON.parse(JSON.stringify(this.players));
    orderedPlayers.sort((a, b) => (a.character_id.index > b.character_id.index) ? 1 : -1);
    this.unpassedRoundPlayers = JSON.parse(JSON.stringify(orderedPlayers));

    for (const player of orderedPlayers) {
      const indexPlayer = getIndex(player, this.players);
      this.playersCharacters[indexPlayer] = true;
      this.unpassedRoundPlayers.shift();

      if (player.isHuman) {
        if (player.character_id.name === THIEF || player.character_id.name === ASSASSIN) {
          this.renderTargetDialog = true;
        } else {
          await this.startTurn(player);
          this.renderStartTurnDialog = true;
        }

        await this.refresh();
        return;
      } else {
        const response: any = await this.startTurn(player);

        if (response.success) {
          await computerPlayTurn(player);
          await this.refresh();
        }
      }
    }
  }

  public async continueGameRoundTable () {
    this.showAllPlayersCharacters();
    for (const player of this.unpassedRoundPlayers) {
      const response: any = await this.startTurn(player);
      this.refresh();
      if (response.success) {
        await computerPlayTurn(player);
      }
    }
    await this.refresh();
  }

  public async endTurn () {
    await this.continueGameRoundTable();
    await this.refresh();
    this.isGameOver = await didSomeoneFinished(this.players);
    if (!this.isGameOver) {
      await this.startCharacterRoundTable();
    } else {
      await this.refresh();
      this.scores = await getScores(this.players);
      this.renderScoreDialog = true;
    }
  }

  public showAllPlayersCharacters () {
    for (const index in this.players) {
      this.playersCharacters[index] = true;
    }
  }

  public async startTurn (player: any, body: any = {}) {
    if ((player.character_id.name === THIEF || player.character_id.name === ASSASSIN) && !player.isHuman) {
      const characters: string[] = [ CONDOTTIERI, ARCHITECT, TRADER, BISHOP, KING, MAGICIAN, THIEF, ASSASSIN ];
      const target: string = characters[Math.floor(Math.random() * characters.length)];
      body = { target };
    }
    const options: IRequestOptions = getOptions(`/player/${player.name}/startTurn`, body);
    const response: any = await request.get(options);
    await this.refresh();
    return response;
  }

  public startChoiceIsOver () {
    this.refresh();
    this.renderStartTurnDialog = false;
  }

  public async selectATarget (targetName: string) {
    const humanPlayer = this.players.filter((player) => player.isHuman)[0];
    await this.startTurn(humanPlayer, { target: targetName });
    this.renderTargetDialog = false;
    this.renderStartTurnDialog = true;
  }
}
</script>

<style lang="css">
body {
  background-color: grey !important;
  background-image: none ;
}
</style>
