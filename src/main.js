import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/style.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import dayOfYear from "dayjs/plugin/dayOfYear";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isLeapYear from "dayjs/plugin/isLeapYear";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(dayOfYear);
dayjs.extend(localizedFormat);
dayjs.extend(isLeapYear);
const app = createApp(App);

app.config.globalProperties.$dayjs = dayjs;
app.use(router);
app.mount("#app");
