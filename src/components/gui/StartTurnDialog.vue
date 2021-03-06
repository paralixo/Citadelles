<template>
  <div>
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <h1>{{ dialogTitle }}</h1>
            </div>

            <div class="modal-body">
              <div v-if="showFirstChoice">
                <MenuButton @click="drawCards">Piocher</MenuButton>
                <MenuButton @click="getMoney">S'enrichir</MenuButton>
              </div>
              <div v-if="showSecondChoice">
                <District :possibility-to-show-popup="true" @discard="discardCard" action-name="Garder" class="card" v-model="temporaryHandData[index]" v-for="(card, index) of temporaryHandImages" :key="index" ><img :src="card" alt=""></District>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { getOptions } from "@/views/services/request-options.service";
import request from "request-promise";
import MenuButton from "@/components/gui/MenuButton.vue";
import District from "@/components/playground/card/District.vue";

  @Component({
    components: { District, MenuButton }
  })
export default class StartTurnDialog extends Vue {
    @Model() public player!: any;
    public showFirstChoice: boolean = true;
    public showSecondChoice: boolean = false;
    public temporaryHandImages : string[] = [];
    public temporaryHandData : string[] = [];

    public async getMoney () {
      const options: IRequestOptions = getOptions(`/player/${this.player.name}/choice/0`, {});
      let response: any = await request.get(options);
      this.closeDialog();
    }

    public async drawCards () {
      const options: IRequestOptions = getOptions(`/player/${this.player.name}/choice/1`, {});
      await request.get(options);
      this.$emit("draw");
      setTimeout(() => {
        this.getTemporaryHand();
        this.showSecondChoice = this.temporaryHandData.length !== 0;
        if (!this.showSecondChoice) {
          this.closeDialog();
        }
      }, 100);

      this.showFirstChoice = false;
    }

    public async discardCard (card: any) {
      const cardIndex: number = this.temporaryHandData.findIndex((temporaryCard) => temporaryCard === card);
      const options: IRequestOptions = getOptions(`/player/${this.player.name}/discard/${cardIndex}`, {});
      await request.get(options);
      this.closeDialog();
    }

    public getTemporaryHand () {
      this.temporaryHandImages = [];
      this.temporaryHandData = [];
      for (const card of this.player.temporary_hand) {
        this.temporaryHandImages.push(this.getImage(card.image));
        this.temporaryHandData.push(card);
      }
    }

    public getImage (imageName: string) {
      return require("../../assets/images/cards/" + imageName);
    }

    public closeDialog () {
      this.$emit("choice-over");
    }

    public get dialogTitle () {
      return this.showFirstChoice ? "Selectionne une action" : "Garde une carte";
    }
}
</script>

<style lang="css" scoped>
  .card{
    display: inline-block;
    margin-right: 10px
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    position: relative;
    bottom: 12%;
  }

  .modal-container {
    width: 500px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

</style>
