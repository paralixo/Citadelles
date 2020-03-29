<template>
  <div>
    <div @click="selectCharacter">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-property-decorator";

@Component
export default class Character extends Vue {
  @Model() public character : any;

  public selectCharacter () {
    this.$emit("select", this.character);
  }
}
</script>

<style lang="css" scoped>

</style>
