<template>
<div>
      <Playground><img class="playground" src="../assets/images/playground.png" alt=""></Playground>
      <div class="hand">

        <Card class="card" v-for="(card, key) of cards" :key="key" ><img :src="card" alt=""></Card>
      </div>
      <div class="coin">
        <Coin><img class="coinSprite" src="../assets/images/piece.jpg" alt=""></Coin>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import Card from "@/components/Card.vue"
import Coin from "@/components/Coin.vue"
import Playground from "@/components/Playground.vue"

@Component({
  components: { Card, Coin, Playground }
})
export default class Board extends Vue {
  public nbrPlayer : number = 2;
  public cards : any[] = [require("../assets/cards/roi.jpg"), require("../assets/cards/roi.jpg"), require("../assets/cards/roi.jpg")];
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
