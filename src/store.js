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
      state.docsUploadStarted = false;
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
    uploadDocs({ commit, state }, formData) {
      commit("uploadStarted");
      commit("createDocsUUID");

      fetch(`/api/addDocs/${state.docsUUID}`, {
        method: "PUT",
        body: formData
      }).then(res => {
        res.ok ? commit("uploadFinished") : commit("resetState");
      });
    },
    resetDocsUpload({ commit, state }) {
      fetch(`/api/removeDocs/${state.docsUUID}`, { method: "DELETE" }).then(
        res => {
          res.ok ? commit("resetState") : null;
        }
      );
    }
  },
  plugins: [createPersistedState()]
});
