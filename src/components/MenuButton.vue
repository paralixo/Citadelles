<template>
    <a :href="href"><slot></slot></a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MenuButton extends Vue {
  @Prop() private href!: string;
}
</script>

<style scoped>
  a {
    width: 220px;
    margin: 0 auto 20px;
    padding: 10px;
    display: block;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: rgba(236, 240, 241, 0.5);
    color: #757e80;
    cursor: pointer;
    text-align: center;
    font-size: 1rem;
    text-decoration: none;
    font-weight: 700;
    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  }

  a:hover {
    box-shadow: 0 0 40px 40px #fefefe inset;
  }
</style>
