<template>
  <div id="menu">
    <img id="logo" src="~@/assets/images/citadelles.png" alt="electron-vue" />
    <MenuButton href="#/gameConfiguration">Un joueur</MenuButton>
    <MenuButton class="disabled" href="#/multiplayerConfiguration">Multijoueur</MenuButton>
    <MenuButton class="disabled" href="#/options">Options</MenuButton>
    <MenuButton href="#/credits">Crédits</MenuButton>
    <MenuButton href="#/quit">Quitter</MenuButton>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MenuButton from "@/components/gui/MenuButton.vue";

@Component({
  components: { MenuButton }
})
export default class Home extends Vue {
}
</script>

<style>
  html {
    height: 100%;
    margin: 0;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("https://images7.alphacoders.com/620/620675.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    color: #ecf0f1;
    font-family: sans-serif;
    line-height: 1.4;
  }

  #logo {
    opacity: 0.8;
  }

  #menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(202, 202, 202, 0.6);
    padding: 20px;
    text-align: center;
    border-radius: 15px;
    visibility: visible;
    -webkit-animation: fadein 1.5s;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
