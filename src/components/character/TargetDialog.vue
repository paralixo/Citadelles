import request from "request-promise";
<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h1>Choisis une cible</h1>
          </div>

          <div class="modal-body">
            <template v-for="(character, key) of characters" >
                <img @click="selectCharacter(character.name)" :key="key" :src="require(`../../assets/images/cards/${character.image}`)" alt="">
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
import { IRequestOptions } from "../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { getOptions } from "@/views/services/request-options.service";
import request from "request-promise";

@Component
export default class TargetDialog extends Vue {
  public characters: any[] = [];

  public async allCharacters () {
    const options: IRequestOptions = getOptions("/Character", {}, true);
    let response: any = await request.get(options);
    this.characters = response.data;
  }

  public async mounted () {
    await this.allCharacters();
  }

  public selectCharacter (characterName: string) {
    this.$emit("select", characterName);
  }
}
</script>

<style lang="css" scoped>
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
    width: 900px;
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
    display: flex;
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
