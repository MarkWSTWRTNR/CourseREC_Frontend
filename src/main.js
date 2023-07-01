import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"
const app = createApp(App);
app.component("v-select",vSelect)
app.use(store)
app.use(router)
app.mount("#app");
