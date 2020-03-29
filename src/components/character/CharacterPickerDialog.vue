<template>
  <div>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h1>Selectionne un personnage</h1>
          </div>

          <div class="modal-body">
            <Character @select="selectCharacter" class="card" v-model="characters[index]" v-for="(character, index) of characters" :key="index"><img :src="require('../../assets/images/dos_cartes.jpg')" alt=""></Character>
          </div>
        </div>
      </div>
    </div>
  </transition>
    <character-dialog v-model="selectedCharacter" v-if="showCharacterDescription" @close="closeDialog" />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import Character from "@/components/character/Character.vue";
import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { getOptions } from "@/views/services/request-options.service";
import request from "request-promise";
import CharacterDialog from "@/components/character/CharacterDialog.vue";

  @Component({
    components: { Character, CharacterDialog }
  })
export default class CharacterPickerDialog extends Vue {
    @Model() public characters: any;
    @Prop() public currentPlayerName: string = "";
    public selectedCharacter: any = {};
    public showCharacterDescription: boolean = false;

    public async selectCharacter (character: any) {
      const cardIndex: number = this.characters.findIndex((card: any) => card === character);
      this.selectedCharacter = this.characters[cardIndex];
      this.showCharacterDescription = true;
      const options: IRequestOptions = getOptions(`/player/${this.currentPlayerName}/character/${cardIndex}`, {});
      let response: any = await request.get(options);
    }

    public closeDialog () {
      this.showCharacterDescription = false;
      this.$emit("select");
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
