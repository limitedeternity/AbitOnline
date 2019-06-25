<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <h1 v-text="$t('table')"></h1>
      </v-flex>

      <v-flex xs12 sm6 offset-sm3 mt-3>
        <v-select
          v-model="speciality"
          color="teal"
          :items="specialities"
          :label="$t('spec')"
        ></v-select>
      </v-flex>

      <v-flex xs12 sm6 offset-sm3 mt-5>
        <v-data-table
          :headers="table.headers"
          :hide-headers="table.headers.length === 0"
          :hide-actions="table.abiturs.length === 0"
          :items="table.abiturs"
          :loading="isLoading"
          class="elevation-3"
        >
          <v-progress-linear
            v-slot:progress
            color="teal"
            indeterminate
          ></v-progress-linear>
          <template v-slot:items="props">
            <template v-for="(value, key, index) in props.item">
              <td :key="index" class="text-xs-center">
                {{ value }}
              </td>
            </template>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
td {
  padding: 12px 24px !important;
}
</style>

<script>
export default {
  name: "Table",
  data: () => ({
    speciality: "",
    specialities: [],
    table: {
      headers: [],
      abiturs: []
    },
    isLoading: false,
    polling: null
  }),
  watch: {
    speciality: "updateTable"
  },
  created() {
    fetch("/api/getSpecialities", { method: "GET" })
      .then(res => res.json())
      .then(json => (this.specialities = json));
  },
  beforeDestroy() {
    if (this.polling) {
      clearTimeout(this.polling);
    }
  },
  methods: {
    updateTable() {
      if (this.polling) {
        clearTimeout(this.polling);
      }

      this.isLoading = true;

      fetch(`/api/getTable?spec=${encodeURIComponent(this.speciality)}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(json => (this.table = json))
        .then(() => {
          this.isLoading = false;
          this.polling = setTimeout(this.updateTable, 20000);
        });
    }
  }
};
</script>
