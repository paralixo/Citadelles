<template>
    <div>
      <div v-if="render" class="board">
        <h1>Cité</h1>
        <District :possibility-to-show-popup="true" class="card" v-model="boardData[index]" v-for="(card, index) of boardImage" :key="index" ><img :src="card" alt=""></District>
      </div>
      <div v-if="render" class="hand">
        <h1>Main</h1>
        <District :possibility-to-show-popup="currentPlayer.isHuman" action-name="Acheter" @buy="buyDistrict" class="card" v-model="handData[index]" v-for="(card, index) of handImages" :key="index"><img :src="showImage(card)" alt=""></District>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Model, Vue, Watch } from "vue-property-decorator";
import District from "@/components/playground/card/District.vue";
import request from "request-promise";
import { getOptions } from "@/views/services/request-options.service";
import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";

@Component({
  components: { District }
})
export default class Playground extends Vue {
  @Model() currentPlayer!: any;
  public render: boolean = true;
  public handImages : string[] = [];
  public handData : string[] = [];
  public boardImage : string[] = [];
  public boardData : string[] = [];

  @Watch("currentPlayer")
  public onPlayersChange () {
    this.getHandOfPlayer();
    this.getDistrictZonePlayer();
    this.rerender();
  }

  public rerender () {
    this.render = false;
    this.$nextTick(() => {
      this.render = true;
    });
  }

  public async buyDistrict (card: any) {
    const cardIndex: number = this.handData.findIndex((handCard) => handCard === card);
    let options: IRequestOptions = getOptions(`/player/${this.currentPlayer.name}/buy/${cardIndex}`, {});
    await request.get(options);
    this.$emit("buy");
  }

  public getHandOfPlayer () {
    this.handImages = [];
    this.handData = [];
    for (const card of this.currentPlayer.hand) {
      this.handImages.push(this.getImage(card.image));
      this.handData.push(card);
    }
  }

  public getDistrictZonePlayer () {
    this.boardImage = [];
    this.boardData = [];
    for (const card of this.currentPlayer.board) {
      this.boardImage.push(this.getImage(card.image));
      this.boardData.push(card);
    }
  }

  public getImage (imageName: string) {
    return require("../../assets/images/cards/" + imageName);
  }

  public showImage (card: any) {
    if (this.currentPlayer.isHuman) {
      return card;
    }
    return require("../../assets/images/dos_cartes.jpg");
  }
}
</script>

<style lang="css" scoped>
.hand{
  position: absolute;
  width: 100%;
  bottom: calc(50% - 220px);
  left:0%;
}

.board {
  position: absolute;
  width: 100%;
  bottom: calc(50% + 10px);
  left:0%;
}

.card{
  display: inline-block;
  margin-right: 10px
}

h1 {
  font-size: 22px;
  width: 100%;
}
</style>
