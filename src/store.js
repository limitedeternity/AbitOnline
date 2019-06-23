import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    locale: "en",
    docsUploaded: false,
    docsUploadStarted: false,
    docsUUID: null
  },
  getters: {
    locale: state => state.locale,
    docsUploaded: state => state.docsUploaded,
    docsUploadStarted: state => state.docsUploadStarted,
    docsUUID: state => state.docsUUID
  },
  mutations: {
    setLocale(state, locale) {
      state.locale = locale;
    },
    createDocsUUID(state) {
      state.docsUUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        c => {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    resetState(state) {
      state.docsUploaded = false;
      state.docsUUID = null;
    },
    uploadStarted(state) {
      state.docsUploadStarted = true;
    },
    uploadFinished(state) {
      state.docsUploaded = true;
      state.docsUploadStarted = false;
    }
  },
  actions: {
    async setDocsUploaded({ commit } /*, formData*/) {
      commit("uploadStarted");
      commit("createDocsUUID");

      // await fetch(`/addDocs?id=${state.docsUUID}`, { method: "POST", body: formData });
      // На сервере создаются папки "направление/абитуриент-uuid/<здесь загруженные файлы>"

      commit("uploadFinished");
    },
    async resetDocsUpload({ commit }) {
      // await fetch(`/removeDocs?id=${state.docsUUID}`, { method: "DELETE" });
      // На сервере удаляются папки, оканчивающиеся на "-uuid"

      commit("resetState");
    }
  },
  plugins: [createPersistedState()]
});
