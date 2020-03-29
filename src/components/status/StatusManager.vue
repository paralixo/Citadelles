<template>
  <div>
    <Status
      @show-playground="switchPlayground"
      :id="`status${index}`"
      v-for="(player, index) in players"
      :key="index"
      :status="getStatusOfPlayer(player)"/>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";
import Status from "@/components/status/Status.vue";
import { IStatus } from "@/components/status/status.interface";

@Component({
  components: { Status }
})
export default class StatusManager extends Vue {
  @Model() players!: any;

  public getStatusOfPlayer (player: any): IStatus {
    const characterName: string = player.character_id === null ? "???" : player.character_id.name;
    return {
      name: player.name,
      money: player.money,
      cardsInHand: player.hand.length,
      character: characterName,
      board: player.board
    };
  }

  public switchPlayground (playerName: string) {
    this.$emit("show-playground", playerName);
  }
}
</script>

<style scoped>
.status-window {
  position: absolute;
}
#status0 {
  bottom: 0px;
  left: calc(50% - 130px);
}
#status1 {
  bottom: 0px;
  left: calc(75% - 130px);
}
#status2 {
  bottom: calc(50% - 75px);
  right: 0px;
}
#status3 {
  top: 0px;
  left: calc(66% - 130px);
}
#status4 {
  top: 0px;
  left: calc(33% - 130px);
}
#status5 {
  bottom: calc(50% - 75px);
  left: 0px;
}
#status6 {
  bottom: 0px;
  left: calc(25% - 130px);
}
</style>
