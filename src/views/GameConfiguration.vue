<template>
  <MenuButton href="#/">Retour</MenuButton>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import MenuButton from "@/components/MenuButton.vue"

@Component({
  components: { MenuButton }
})
export default class GameConfiguration extends Vue {
}
</script>

<style scoped>

</style>
