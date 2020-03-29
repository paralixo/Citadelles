<template>
  <div>
    <StatusManager v-model="players" @show-playground="switchPlayground"/>
    <MenuButton href="#/gameConfiguration">Retour</MenuButton>
    <MenuButton @click="endTurn">Tour suivant</MenuButton>
    <MenuButton @click="refresh">Refresh</MenuButton>
    <Playground v-model="currentPlayer" @buy="refresh"/>
    <CharacterPickerDialog v-if="renderCharacterDialog" v-model="characterDeck" :current-player-name="currentPlayer.name" @select="characterIsSelected"/>
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

@Component({
  components: { Playground, MenuButton, StatusManager, CharacterPickerDialog }
})
export default class Board extends Vue {
  public players: any[] = [];
  public currentPlayer: any = {};
  public characterDeck: any[] = [];
  public renderCharacterDialog: boolean = false;
  public unpassedRoundPlayers: any[] = [];

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
    let response: any = await request.get(options);
    this.players = response.data;
  }

  public switchPlayground (playerName: string) {
    this.currentPlayer = this.players.find(player => player.name === playerName);
  }

  public async generateCharacterDeck () {
    const options: IRequestOptions = getOptions("/generateCharacters", {});
    let response: any = await request.get(options);
    await this.fetchCharacterDeck();
  }

  public async fetchCharacterDeck () {
    const options: IRequestOptions = getOptions("/Deck", { type: "character" }, true);
    let response: any = await request.get(options);
    this.characterDeck = await this.fetchCharacterName(response.data[0].cards);
  }

  public async fetchCharacterName (cardsIds: string[]): Promise<any[]> {
    let characters: any[] = [];
    for (const cardId of cardsIds) {
      const options: IRequestOptions = getOptions("/Character", { _id: cardId }, true);
      let response: any = await request.get(options);
      characters.push(response.data[0]);
    }
    return characters;
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
        await this.computerChooseCharacter(player);
      }
    }
  }

  public async continueCharacterRoundTable () {
    for (const player of this.unpassedRoundPlayers) {
      await this.computerChooseCharacter(player);
    }
    await this.refresh();
  }

  public async characterIsSelected () {
    this.renderCharacterDialog = false;
    await this.continueCharacterRoundTable();
    await this.refresh();
    await this.startGameRoundTable();
  }

  public async computerChooseCharacter (player: any) {
    const options: IRequestOptions = getOptions(`/player/${player.name}/character/0`, {});
    let response: any = await request.get(options);
  }

  public async startGameRoundTable () {
    let orderedPlayers: any[] = JSON.parse(JSON.stringify(this.players));
    orderedPlayers.sort((a, b) => (a.character_id.index > b.character_id.index) ? 1 : -1);
    this.unpassedRoundPlayers = JSON.parse(JSON.stringify(orderedPlayers));
    for (const player of orderedPlayers) {
      this.unpassedRoundPlayers.shift();
      await this.startTurn(player);
      if (player.isHuman) {
        await this.refresh();
        return;
      } else {
        await this.computerPlayTurn(player);
        await this.refresh();
      }
    }
  }

  public async continueGameRoundTable () {
    for (const player of this.unpassedRoundPlayers) {
      await this.startTurn(player);
      await this.computerPlayTurn(player);
    }
    await this.refresh();
  }

  public async endTurn () {
    await this.continueGameRoundTable();
    await this.refresh();
    await this.startCharacterRoundTable();
  }

  public async startTurn (player: any) {
    const options: IRequestOptions = getOptions(`/player/${player.name}/startTurn`, {});
    const response: any = await request.get(options);
    await this.refresh();
  }

  public async computerPlayTurn (player: any) {
    let options: IRequestOptions = getOptions(`/player/${player.name}/computer/choiceBeginning`, {});
    let response: any = await request.get(options);
    options = getOptions(`/player/${player.name}/computer/buyDistrict`, {});
    response = await request.get(options);
  }
}
</script>

<style lang="css">
body {
  background-color: grey !important;
  background-image: none ;
}
</style>
