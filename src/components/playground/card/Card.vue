<template>
    <div @click="playCard">
      <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PurchaseDialogue from "@/components/playground/card/PurchaseDialog.vue";

@Component({
  components: { PurchaseDialogue }
})

export default class Card extends Vue {
  @Prop() public card : any;
  public playCard () {
    console.log(this.card.name);
  }
}
</script>

<style lang="css" scoped>

</style>
