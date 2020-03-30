<template>
  <div class="credits">
    <p>
      Clément MEHAYE<br />
      &<br />
      Florian LAFUENTE
    </p>
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
.credits {
  position: relative;
  top: 300px;
}
</style>
