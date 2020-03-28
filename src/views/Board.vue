<template>
  <div>
    <StatusManager v-model="players"/>
    <MenuButton href="#/gameConfiguration">Retour</MenuButton>
    <MenuButton @click="fetchPlayers">Refresh</MenuButton>
    <Playground v-model="players"/>
<!--    <div class="districtZone">-->
<!--      <Card class="card" :card="districtZoneData[index]" v-for="(card, index) of districtZoneImage" :key="index" ><img :src="card" alt=""></Card>-->
<!--    </div>-->
<!--    <div class="hand">-->
<!--      <Card class="card" :card="handData[index]" v-for="(card, index) of handImages" :key="index"><img :src="card" alt=""></Card>-->
<!--    </div>-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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
  public handImages : string[] = [];
  public handData : string[] = [];
  public districtZoneImage : string[] = [];
  public districtZoneData : string[] = [];
  public players: any[] = [];

  public async fetchPlayers () {
    const options: IRequestOptions = getOptions("/Player", {}, true);
    let response: any = await request.get(options);
    this.players = response.data;
  }

  public getCurrentPlayer () {
    return this.players[0];
  }

  public getHandOfPlayer () {
    this.handImages = [];
    let handPlayer : any[] = this.getCurrentPlayer().hand;
    for (const card of handPlayer) {
      this.handImages.push(require("../assets/images/cards/" + card.image));
      this.handData.push(card);
    }
  }

  public getDistrictZonePlayer () {
    this.districtZoneImage = [];
    let districtZone : any[] = this.getCurrentPlayer().board;
    for (const card of districtZone) {
      this.districtZoneImage.push(require("../assets/images/cards/" + card.image));
      this.districtZoneData.push(card);
    }
  }

  async mounted () {
    await this.fetchPlayers();
  }
}
</script>

<style lang="css">

.hand{
  position: absolute;
  bottom: 155px;
  left:30%;
}

.districtZone {
  position: absolute;
  bottom: calc(155px + 180px);
  left:30%;
}

.card{
  display: inline-block;
  margin-right: 10px
}

body {
  background-color: grey !important;
  background-image: none ;
}
</style>
