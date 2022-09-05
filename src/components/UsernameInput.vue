<template>
  <div class="container">
    <div class="toast">
      <h3>Welcome!</h3>
      <p>It seems like this is your first time here. Please enter a username.</p>
      <form @submit="submit">
        <input type="text" v-model="username" />
        <button class="btn">OK</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

const username = ref("");

const submit = (e) => {
  e.preventDefault();
  if(username.value) {
    localStorage.username = username.value;
    settingsStore.username = username.value;
  } else {
    localStorage.username = "Anonymous";
    settingsStore.username = "Anonymous";
  }
};
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

.toast form {
  display: flex;
  flex-direction: column;
}

.toast form input {
  background-color: var(--input-color);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
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
