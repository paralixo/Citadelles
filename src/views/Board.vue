<template>
<div>
      <div class="hand">
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
        <Card class="card" ><img src="../assets/cards/roi.jpg" alt=""></Card>
      </div>
      <div>
        <Coin><img src="../assets/images/piece.jpg" alt=""></Coin>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import Card from "@/components/Card.vue"
import Coin from "@/components/Coin.vue"

@Component({
  components: { Card, Coin }
})
export default class Board extends Vue {

}
</script>

<style lang="css">

.hand{
  position: absolute;
  bottom: 5%;
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
</style>
