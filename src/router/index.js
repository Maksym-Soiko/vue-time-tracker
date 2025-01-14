import { createRouter, createWebHistory } from "vue-router";
import TimeTrackerHomePage from "../components/TimeTrackerHomePage.vue";
import StatisticsPage from "../components/StatisticsPage.vue";

const routes = [
  { path: "/", name: "Home", component: TimeTrackerHomePage },
  { path: "/statistics", name: "Statistics", component: StatisticsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
