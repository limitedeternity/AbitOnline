<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-3>
        <v-btn
          v-for="entry in languages"
          :key="entry.title"
          @click="changeLocale(entry.language)"
        >
          <flag :iso="entry.flag" :squared="false" />
          &nbsp;{{ entry.title }}
        </v-btn>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <h1 v-text="$t('welcome')"></h1>
      </v-flex>

      <v-flex xs12 sm6 offset-sm3>
        <blockquote
          class="blockquote text-xs-center"
          v-text="$t('home_text')"
        ></blockquote>
      </v-flex>

      <v-flex xs12 sm6 offset-sm3 mt-3>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            color="teal"
            :rules="nameRules"
            :label="$t('name')"
            required
          ></v-text-field>
          <v-text-field
            v-model="email"
            color="teal"
            :rules="emailRules"
            :label="$t('email')"
            required
          ></v-text-field>

          <v-flex class="text-xs-center" mt-5>
            <template v-if="!docsUploaded">
              <v-btn
                dark
                color="teal"
                @click="
                  if ($refs.form.validate() && !docsUploadStarted)
                    $refs.inputUpload.click();
                "
                v-text="!docsUploadStarted ? $t('submit_docs') : '•••'"
              ></v-btn>
              <input
                v-show="false"
                ref="inputUpload"
                type="file"
                multiple
                @change="sendDocs"
              />
            </template>
            <template v-else>
              <v-btn
                dark
                color="success"
                @click="resetDocsUpload"
                v-text="$t('remove_docs')"
              ></v-btn>
            </template>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Home",
  data: () => ({
    languages: [
      { flag: "us", language: "en", title: "English" },
      { flag: "ru", language: "ru", title: "Русский" }
    ],
    name: "",
    email: "",
    nameRules: [
      v => Boolean(v) || window.vm.$t("name_empty_error"),
      v =>
        (v.match(/([А-Яа-я]+)|([A-Za-z]+)/g) || []).length === 2 ||
        (v.match(/([А-Яа-я]+)|([A-Za-z]+)/g) || []).length === 3 ||
        window.vm.$t("name_regex_error")
    ],
    emailRules: [
      v => Boolean(v) || window.vm.$t("email_empty_error"),
      v => /.+@.+/.test(v) || window.vm.$t("email_regex_error")
    ]
  }),
  computed: {
    ...mapGetters(["docsUploaded", "docsUploadStarted"])
  },
  mounted() {
    // fetch("/getSpecialities", { method: "GET" }).then(res => res.json()).then(json => ...);
    // JSON с направлениями пихаем в data и рендерим в форме в виде выпадающего списка. 
    // В sendDocs в fd добавляем id направления.
  },
  methods: {
    ...mapActions(["uploadDocs", "resetDocsUpload"]),
    ...mapMutations(["setLocale"]),
    sendDocs() {
      let fd = new FormData();
      let filelist = this.$refs.inputUpload.files;
      if (filelist.length !== 4) return; // Или сколько нужно

      fd.append(
        "name",
        Array.from(this.name.match(/([А-Яа-я]+)|([A-Za-z]+)/g)).join(" ")
      );
      fd.append("email", this.email);

      for (let i = 0; i < filelist.length; i++) {
        fd.append("files", filelist[i], filelist[i].name);
      }

      this.uploadDocs(fd);
    },
    changeLocale(locale) {
      this.$i18n.locale = locale;
      this.setLocale(locale);
      this.$refs.form.validate();
    }
  }
};
</script>
