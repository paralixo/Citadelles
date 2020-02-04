<template>
    <div>
        <slot></slot>
        <p class="count">{{coins}}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Card extends Vue {
    @Prop() public src!: string
    public coins : number = 8;
}
</script>

<style lang="css" scoped>

.count{
    color: red;
    position: absolute;
    bottom:0%;
    left:40%;
    font-size:34px
}

</style>
