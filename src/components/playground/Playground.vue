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
import { Component, Model, Vue, Watch } from "vue-property-decorator";
import Card from "@/components/playground/card/Card.vue";

@Component({
  components: { Card }
})
export default class Playground extends Vue {
  @Model() currentPlayer!: any;
  public handImages : string[] = [];
  public handData : string[] = [];
  public districtZoneImage : string[] = [];
  public districtZoneData : string[] = [];

  @Watch("currentPlayer")
  public onPlayersChange () {
    this.getHandOfPlayer();
    this.getDistrictZonePlayer();
  }

  public getHandOfPlayer () {
    this.handImages = [];
    let handPlayer : any[] = this.currentPlayer.hand;
    for (const card of handPlayer) {
      this.handImages.push(require("../../assets/images/cards/" + card.image));
      this.handData.push(card);
    }
  }

  public getDistrictZonePlayer () {
    this.districtZoneImage = [];
    let districtZone : any[] = this.currentPlayer.board;
    for (const card of districtZone) {
      this.districtZoneImage.push(require("../../assets/images/cards/" + card.image));
      this.districtZoneData.push(card);
    }
  }
}
</script>

<style lang="css" scoped>
.hand{
  position: absolute;
  bottom: 155px;
  left:30%;
}

.board {
  position: absolute;
  bottom: calc(155px + 180px);
  left:30%;
}

.card{
  display: inline-block;
  margin-right: 10px
}
</style>
