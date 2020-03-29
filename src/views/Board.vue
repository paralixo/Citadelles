<template>
  <div>
    <StatusManager v-model="players" @show-playground="switchPlayground"/>
    <MenuButton href="#/gameConfiguration">Retour</MenuButton>
    <MenuButton @click="refresh">Refresh</MenuButton>
    <Playground v-model="currentPlayer" @buy="refresh"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Card from "@/components/playground/card/Card.vue";
import Playground from "@/components/playground/Playground.vue";
import MenuButton from "@/components/gui/MenuButton.vue";
import { getOptions } from "@/views/services/request-options.service";
import { IRequestOptions } from "../../tests/unit/api/database/interfaces/RequestOptions.interface";
import request from "request-promise";
import StatusManager from "@/components/status/StatusManager.vue";

@Component({
  components: { Card, Playground, MenuButton, StatusManager }
})
export default class Board extends Vue {
  public players: any[] = [];
  public currentPlayer: any = {};

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

  async mounted () {
    await this.fetchPlayers();
    this.switchPlayground(this.players[0].name);
  }
}
</script>

<style lang="css">
body {
  background-color: grey !important;
  background-image: none ;
}
</style>
