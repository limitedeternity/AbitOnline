import Vue from "vue";
import "./plugins/vuetify";
import "./plugins/flag-icons";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import i18n from "./i18n";

Vue.config.productionTip = false;

let vm = new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});

window.vm = vm;
