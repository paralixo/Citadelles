<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
@Component
export default class Card extends Vue {
    @Prop() public src!: string
}
</script>

<style lang="css" scoped>

</style>
