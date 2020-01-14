<template>
<div>
      <Playground><img class="playground" src="../assets/images/rectangle-.png-5.png" alt=""></Playground>
      <div class="hand">
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
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
</style>
