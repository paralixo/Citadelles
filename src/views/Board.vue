<template>
  <div>
    <StatusManager v-model="players" @show-playground="switchPlayground"/>
    <MenuButton href="#/gameConfiguration">Retour</MenuButton>
    <MenuButton @click="refresh">Refresh</MenuButton>
    <Playground v-model="currentPlayer" @buy="refresh"/>
    <CharacterPickerDialog v-if="renderCharacterDialog" v-model="characterDeck" :current-player-name="currentPlayer.name" @select="characterIsSelected"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import District from "@/components/playground/card/District.vue";
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
  public renderCharacterDialog: boolean = true;

  public async refresh () {
    await this.fetchPlayers();
    this.switchPlayground(this.currentPlayer.name);
  }

  public characterIsSelected () {
    this.renderCharacterDialog = false;
    this.refresh();
  }

  public async fetchPlayers () {
    const options: IRequestOptions = getOptions("/Player", {}, true);
    let response: any = await request.get(options);
    this.players = response.data;
  }

  public switchPlayground (playerName: string) {
    this.currentPlayer = this.players.find(player => player.name === playerName);
  }

  async mounted () {
    await this.fetchPlayers();
    this.switchPlayground(this.players[0].name);
    this.fetchCharacterDeck();
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
}
</script>

<style lang="css">
body {
  background-color: grey !important;
  background-image: none ;
}
</style>
