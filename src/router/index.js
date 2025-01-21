import { createRouter, createWebHistory } from "vue-router";
import TimeTrackerHomePage from "../components/TimeTrackerHomePage.vue";
import StatisticsPage from "../components/StatisticsPage.vue";
import AuthSelectionPage from "../components/AuthSelectionPage.vue";
import RegisterPage from "../components/RegisterPage.vue";
import LoginPage from "../components/LoginPage.vue";

const routes = [
  { path: "/", name: "AuthSelection", component: AuthSelectionPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/home", name: "Home", component: TimeTrackerHomePage },
  { path: "/statistics", name: "Statistics", component: StatisticsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;