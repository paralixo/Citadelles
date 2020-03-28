<template>
  <div class="status-window">
    <h1>{{status.name}}</h1>
    <div id="status-parameters">
      <div class="status-panel">
        <div>
          <h2>Personnage</h2>
          <p>{{status.character}}</p>
        </div>
        <div>
          <h2>Cartes en main</h2>
          <p>{{status.cardsInHand}}</p>
        </div>
      </div>
      <div class="status-panel">
        <h2>Pièces d'or</h2>
        <p>{{status.money}}</p>
      </div>
      <div class="status-panel">
        <h2>Quartiers</h2>
        <div>
          <span
            :key="`military-${i}`"
            v-for="i in districtsPerType.military"
            class="dot"
            style="background-color: red">
          </span>
        </div>
        <div>
          <span
            :key="`noble-${i}`"
            v-for="i in districtsPerType.noble"
            class="dot"
            style="background-color: yellow">
          </span>
        </div>
        <div>
          <span
            :key="`trade-${i}`"
            v-for="i in districtsPerType.trade"
            class="dot"
            style="background-color: green">
          </span>
        </div>
        <div>
          <span
            :key="`religious-${i}`"
            v-for="i in districtsPerType.religious"
            class="dot"
            style="background-color: blue">
          </span>
        </div>
        <div>
          <span
            :key="`prestigious-${i}`"
            v-for="i in districtsPerType.prestigious"
            class="dot"
            style="background-color: purple">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";
import { IStatus } from "@/components/interfaces/status.interface";
import { MILITARY, NOBLE, PRESTIGIOUS, RELIGIOUS, TRADE } from "@/api/database/constants/district-type.constants";

@Component
export default class Status extends Vue {
  @Prop() status!: IStatus;
  public districtsPerType: any = this.numberOfDistrictsPerType();

  @Watch("status")
  public onStatusChange () {
    this.districtsPerType = this.numberOfDistrictsPerType();
  }

  public numberOfDistrictsPerType () {
    let districtsPerType = {
      military: 0,
      religious: 0,
      noble: 0,
      prestigious: 0,
      trade: 0
    };

    for (const district of this.status.board) {
      // @ts-ignore
      const type: string = district.type.label;
      switch (type) {
        case MILITARY:
          districtsPerType.military++;
          break;
        case RELIGIOUS:
          districtsPerType.religious++;
          break;
        case TRADE:
          districtsPerType.trade++;
          break;
        case PRESTIGIOUS:
          districtsPerType.prestigious++;
          break;
        case NOBLE:
          districtsPerType.noble++;
          break;
      }
    }

    return districtsPerType;
  }

  created () {
    this.districtsPerType = this.numberOfDistrictsPerType();
  }
}
</script>

<style lang="css" scoped>
.status-window {
  display: inline-block;
  justify-content: center;
  font-size: 11px;
  border: #2c3e50 1px solid;
  padding: 0 7px;
  background-color: aliceblue;
  height: 150px;
  width: 260px;
}
#status-parameters {
  display: flex;
  flex-direction: row;
}
.status-panel {
  padding: 0 7px;
}
h1, h2 {
  font-size: 12px;
}
.dot {
  height: 12px;
  width: 12px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}
</style>
