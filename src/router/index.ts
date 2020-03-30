import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import GameConfiguration from "@/views/GameConfiguration.vue";
import Board from "@/views/Board.vue";
import Credits from "@/views/Credits.vue";

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
  },
  {
    path: "/credits",
    name: "credits",
    component: Credits
  }
];

const router = new VueRouter({
  routes
});

export default router;
