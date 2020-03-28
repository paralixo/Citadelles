import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import GameConfiguration from "@/views/GameConfiguration.vue";
import Board from "@/views/Board.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/gameConfiguration",
    name: "gameConfiguration",
    component: GameConfiguration
  },
  {
    path: "/board",
    name: "board",
    component: Board
  }
];

const router = new VueRouter({
  routes
});

export default router;
