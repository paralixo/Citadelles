<template>
  <div>
    <MenuButton @click="newPlayer">Ajouter un joueur</MenuButton>
    <div v-for="(player, index) in players" :key="index">
      Joueur {{ index + 1 }}:
      <input v-model="player.name" :placeholder="'Nom du joueur ' + (index + 1) "/>
      Humain : <input type="checkbox" v-model="player.isHuman" disabled>
      <button v-if="index !== 0" @click="removePlayer(index)">Supprimer</button>
    </div>
    <MenuButton @click="initialize">Jouer</MenuButton>
    <MenuButton href="#/">Retour</MenuButton>

    <MenuButton ref="board" href="#/board" style="display: none"></MenuButton>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MenuButton from "@/components/MenuButton.vue";
import { getOptions } from "@/views/services/request-options.service";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";
import request from "request-promise";
import { IRequestOptions } from "../../tests/unit/api/database/interfaces/RequestOptions.interface";

@Component({
  components: { MenuButton }
})
export default class GameConfiguration extends Vue {
  public players: {name: string, isHuman: boolean}[] = [];
  public playerIndex: number = 1;

  public newPlayer (isHuman: boolean = false) {
    if (this.players.length < 8) {
      this.players.push({
        name: `Joueur ${this.playerIndex}`,
        isHuman
      });
      this.playerIndex++;
    }
  }

  public removePlayer (index: number) {
    if (this.players.length > 1) {
      this.players.splice(index, 1);
    }
  }

  private checkPlayers () : boolean {
    for (const player of this.players) {
      if (player.name.trim() === "") {
        console.log("Please insert your player name");
        return false;
      }
    }
    return true;
  }

  public async initialize () {
    const arePlayersValid: boolean = this.checkPlayers();
    if (arePlayersValid) {
      const options: IRequestOptions = getOptions("/initialize", { players: this.players });
      let response: IResponseData = await request.get(options);
      console.log("initialization: " + response.success);
      if (response.success) {
        // @ts-ignore
        this.$refs.board.$el.click();
      } else {
        console.log("Initilization failed...");
      }
    }
  }

  async created () {
    this.newPlayer(true);
  }
}
</script>

<style scoped>
.name-input {
  display: block;
}
</style>
