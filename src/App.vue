<template>
  <LoaderComponent v-if="globalStore.loading"/>
  <HomeComponent v-else-if="globalStore.room" />
  <WelcomePage v-else />
</template>

<script setup>
  import HomeComponent from "@c/HomeComponent.vue";
  import WelcomePage from "@c/WelcomePage.vue";
  import LoaderComponent from "@c/LoaderComponent.vue"

  import { useGlobalStore } from "./stores/global";
  const globalStore = useGlobalStore();
</script>