import { App, queryClient, router } from "@src/app";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import "./styles/main.css";

const app = createApp(App);

app.use(router);
app.use(VueQueryPlugin, { queryClient });
app.mount("#app");
