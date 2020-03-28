<template>
    <div>
      <div class="board">
        <Card class="card" :card="districtZoneData[index]" v-for="(card, index) of districtZoneImage" :key="index" ><img :src="card" alt=""></Card>
      </div>
      <div class="hand">
        <Card class="card" :card="handData[index]" v-for="(card, index) of handImages" :key="index"><img :src="card" alt=""></Card>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";
import Card from "@/components/playground/card/Card.vue";

@Component({
  components: { Card }
})
export default class Playground extends Vue {
  @Model() players!: any[];
  public handImages : string[] = [];
  public handData : string[] = [];
  public districtZoneImage : string[] = [];
  public districtZoneData : string[] = [];
  public render: boolean = true;

  @Watch("players")
  public onPlayersChange () {
    this.getHandOfPlayer();
    this.getDistrictZonePlayer();
  }

  public getCurrentPlayer () {
    return this.players[0];
  }

  public getHandOfPlayer () {
    this.handImages = [];
    let handPlayer : any[] = this.getCurrentPlayer().hand;
    for (const card of handPlayer) {
      this.handImages.push(require("../../assets/images/cards/" + card.image));
      this.handData.push(card);
    }
  }

  public getDistrictZonePlayer () {
    this.districtZoneImage = [];
    let districtZone : any[] = this.getCurrentPlayer().board;
    for (const card of districtZone) {
      this.districtZoneImage.push(require("../../assets/images/cards/" + card.image));
      this.districtZoneData.push(card);
    }
  }

  created () {
    if (this.players.length >= 1) {
      this.getHandOfPlayer();
      this.getDistrictZonePlayer();
    }
  }
}
</script>

<style lang="css" scoped>

</style>
