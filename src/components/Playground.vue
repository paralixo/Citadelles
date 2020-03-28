<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Playground extends Vue {
}
</script>

<style lang="css" scoped>

</style>
