<template>
  <div>
    <div @click="playCard">
      <slot></slot>
    </div>
    <purchase-dialog v-model="card" v-if="showDialog" @close="closeDialog" @buy="buyDistrict" />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import PurchaseDialog from "@/components/playground/card/PurchaseDialog.vue";

@Component({
  components: { PurchaseDialog }
})

export default class District extends Vue {
  @Model() public card : any;

  public showDialog: boolean = false;
  public closeDialog () {
    this.showDialog = false;
  }

  public buyDistrict () {
    this.$emit("buy", this.card);
    this.closeDialog();
  }

  public playCard () {
    this.showDialog = true;
  }
}
</script>

<style lang="css" scoped>

</style>
