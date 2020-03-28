<template>
  <div>
    <StatusManager v-model="players"/>
    <MenuButton href="#/gameConfiguration">Retour</MenuButton>
    <MenuButton @click="fetchPlayers">Refresh</MenuButton>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Coin from "@/components/Coin.vue";
import Playground from "@/components/Playground.vue";
import MenuButton from "@/components/MenuButton.vue";
import { getOptions } from "@/views/services/request-options.service";
import { IRequestOptions } from "../../tests/unit/api/database/interfaces/RequestOptions.interface";
import request from "request-promise";
import StatusManager from "@/components/StatusManager.vue";

@Component({
  components: { Card, Coin, Playground, MenuButton, StatusManager }
})
export default class Board extends Vue {
  public players: any[] = [];

  public async fetchPlayers () {
    const options: IRequestOptions = getOptions("/Player", {}, true);
    let response: any = await request.get(options);
    this.players = response.data;
  }

  async mounted () {
    this.fetchPlayers();
  }
}
</script>

<style lang="css">

.hand{
  position: absolute;
  bottom: -5%;
  left:35%;

}

.card{
  display: inline-block;
  margin-right: 10px
}

body {
  background-color: grey !important;
  background-image: none ;
}

.coin{
  position: absolute;
  bottom:8%;
  left: 88%;
}

.coinSprite{
  width: 100px;
  height:100px;
}

.playground {
  width: 75%;
}

.swip-up-enter-active {
  transition: all .3s ease;
}
.swip-up-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.swip-up-enter, .swip-up-leave-to
/* .swip-up-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
