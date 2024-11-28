import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import router from "./router";
import { createPinia } from "pinia";
import axios from "axios";
import "./assets/styles/global.css";
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import { setupCalendar } from "v-calendar";
import { createPiniaMiddleware } from "./plugins/piniaMiddleware";
import piniaPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(createPiniaMiddleware());
pinia.use(piniaPersistedstate);

createApp(App)
    .use(HighchartsVue)
    .use(setupCalendar, {})
    .use(pinia)
    .use(router)
    .mount("#app");
