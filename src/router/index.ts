import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import GameConfiguration from "@/views/GameConfiguration.vue"
import Board from "@/views/Board.vue"

Vue.use(VueRouter)

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
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/example/About.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
