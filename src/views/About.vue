<!-- Здесь нужно описание вуза. Минимальные баллы и самая основная информация -->
<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <h1 v-text="$t('about')"></h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3>
        <blockquote
          class="blockquote text-xs-center"
          v-text="$t('about_text')"
        ></blockquote>
      </v-flex>
    </v-layout>
  </v-container>
</template>
