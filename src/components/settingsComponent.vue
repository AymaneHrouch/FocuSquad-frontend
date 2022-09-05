<template>
  <form class="modal-wraper" v-if="globalStore.showSettings" @submit="submit">
    <div class="settings-modal">
      <span class="close-btn" @click="globalStore.showSettings = false">&times;</span>
      <h2 class="modal-heading">Settings</h2>
      <div class="settings-options">
        <div class="setting-option">
          <label for="username-input">Username</label>
          <input autofocus type="text" id="username-input" :value="settingsStore.username" />
        </div>
        <div class="setting-option">
          <label for="quote-input" title="Only you can see it">You Personal Quote</label>
          <input type="text" id="quote-input" :value="settingsStore.quote" />
        </div>
        <div class="setting-option">
          <label for="session-input">Session</label>
          <input type="number" id="session-input" min="1" max="120" :value="settingsStore.session" />
        </div>
        <div class="setting-option">
          <label for="short-break-input">Short Break</label>
          <input
            type="number"
            id="short-break-input"
            min="1"
            max="120"
            :value="settingsStore.shortBreak"
          />
        </div>
        <div class="setting-option">
          <label for="long-break-input">Long Break</label>
          <input
            type="number"
            id="long-break-input"
            min="1"
            max="120"
            :value="settingsStore.longBreak"
          />
        </div>
      </div>
      <button class="btn not-selectable" type="submit">OK</button>
    </div>
  </form>
</template>

<script setup>
import { useGlobalStore } from '@s/global';
import { useSettingsStore } from '@s/settings';

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();

const submit = () => {
  const username = document.getElementById('username-input').value;
  const quote = document.getElementById('quote-input').value;
  const session = parseInt(document.getElementById('session-input').value);
  const shortBreak = parseInt(document.getElementById('short-break-input').value);
  const longBreak = parseInt(document.getElementById('long-break-input').value);
  const res = settingsStore.updateSettings(username, quote, session, shortBreak, longBreak);
  if (res.error) {
    alert(res.error);
  } else {
    globalStore.showSettings = false;
  }
};
</script>

<style scoped>
/** Settings Modal */
.modal-heading {
  padding: 0 0;
  border-bottom: 1px solid #bcbcbc;
  margin: 0;
}

.settings-options {
  padding-top: 1rem;
}

.modal-wraper {
  position: absolute;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-modal {
  background-color: var(--bg-color);
  position: absolute;
  height: auto;
  width: 25rem;
  border-radius: 0.5rem;
  padding: 1rem;
  border: solid #000 2px;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 60px 1px;
}

.setting-option {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center;
}

.setting-option input {
  background-color: var(--input-color);
  padding: 0.5rem;
}

.close-btn {
  float: right;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.3rem;
}

</style>
