<template>
  <div>
    <div @click="playCard">
      <slot></slot>
    </div>
    <district-dialog v-model="card" v-if="showDialog" @close="closeDialog" :action-name="actionName" @action="action" />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import DistrictDialog from "@/components/playground/card/DistrictDialog.vue";

@Component({
  components: { DistrictDialog }
})

export default class District extends Vue {
  @Model() public card : any;
  @Prop() actionName!: string;

  public showDialog: boolean = false;
  public closeDialog () {
    this.showDialog = false;
  }

  public action () {
    switch (this.actionName) {
      case "Garder":
        this.discardDistrict();
        break;
      case "Acheter":
        this.buyDistrict();
        break;
    }
    this.closeDialog();
  }

  public discardDistrict () {
    this.$emit("discard", this.card);
  }

  public buyDistrict () {
    this.$emit("buy", this.card);
  }

  public playCard () {
    this.showDialog = true;
  }
}
</script>

<style lang="css" scoped>

</style>
