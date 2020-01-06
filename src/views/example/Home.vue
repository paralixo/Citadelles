<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png">bison4
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue"
import MenuButton from "@/components/MenuButton"

export default {
  name: "home",
  components: {
    HelloWorld
  }
}
</script>
