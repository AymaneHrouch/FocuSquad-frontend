<template>
  <div class="container" v-if="globalStore.showToast">
    <div class="toast">
      <h3>{{ globalStore.toastData.title }}</h3>
      <p>
        {{ globalStore.toastData.message }}
      </p>
      <span class="btn" @click="globalStore.showToast = false">
        {{ globalStore.toastData.buttonLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '../stores/global';
const globalStore = useGlobalStore();
</script>

<style scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 9999;
}
.toast {
  display: flex;
  flex-direction: column;
  width: 20rem;
  border: #bcbcbc solid 2px;
  box-shadow: #000 0px 0px 10px;
  padding: 1rem;
  position: absolute;
  background-color: var(--bg-color);
}

.toast h3 {
  border-bottom: 1px solid #bcbcbc;
  padding-bottom: 1rem;
}

.toast p {
  padding: 1rem 0;
}

.btn {
  max-width: max-content;
  background-color: #be5ed4;
}

.btn:hover {
  cursor: pointer;
  background-color: #ae36c9;
  color: #000;
  outline: 2px solid #000;
}
</style>
