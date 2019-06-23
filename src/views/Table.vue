<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <h1 v-text="$t('table')"></h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-5>
        <v-data-table
          :headers="table.headers"
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
    table: {
      headers: [
        {
          text: "Абитуриенты",
          align: "left",
          sortable: false,
          value: "name"
        }
      ],
      abiturs: []
    },
    isLoading: true
  }),
  mounted() {
    /*
    (function updateTable() {
      this.isLoading = true;

      fetch("/getTable", { method: "GET" })
        .then(res => res.json())
        .then(json => this.table = json)
        .then(() => setTimeout(updateTable, 20000));
    })();
    */

    new Promise(resolve => setTimeout(resolve, 1200)).then(() => {
      this.table = {
        headers: [
          {
            text: "Абитуриенты",
            align: "left",
            sortable: false,
            value: "name"
          },
          { text: "Русский язык", value: "rus" },
          { text: "Математика", value: "math" },
          { text: "Информатика", value: "inf" },
          { text: "Сумма баллов", value: "sum" },
          { text: "Оригинал", value: "original" }
        ],
        abiturs: [
          {
            name: "Аксонов Алексей Викторович",
            rus: 92,
            math: 70,
            inf: 62,
            sum: 224,
            original: "+"
          },
          {
            name: "Васнецов Иван Андреевич",
            rus: 100,
            math: 60,
            inf: 72,
            sum: 232,
            original: "-"
          }
        ]
      };

      this.isLoading = false;
    });
  }
};
</script>
