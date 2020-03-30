<template>
  <div>
    Developpeurs:
    Clément MEHAYE & Florian LAFUENTE
    <MenuButton href="#/">Retour au menu</MenuButton>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MenuButton from "../components/gui/MenuButton.vue";
  @Component({
    components: { MenuButton }
  })
export default class Credits extends Vue {
}
</script>

<style scoped>

</style>
