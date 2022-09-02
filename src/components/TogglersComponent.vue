<template>
  <div id="togglers" v-if="timerStore.resting">
    <span
      @click="globalStore.toggleChat"
      class="chat-icon svg-icon"
      :title="`${globalStore.showChat ? `Hide` : `Show`} Chat`"
    ></span>
    <span
      @click="globalStore.toggleSettings"
      class="settings-icon svg-icon"
      :title="`${globalStore.showSettings ? `Hide` : `Open`} Settings`"
    ></span>
  </div>
  <span @click="logout" class="svg-icon logout-icon" title="Logout"></span>
</template>

<script setup>
import { useGlobalStore } from '@s/global';
import { useSettingsStore } from '@s/settings';
import { useTimerStore } from '@s/timer';

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const timerStore = useTimerStore();

const logout = () => {
  // redirect to welcome page
  window.location.href = '.';
};
</script>

<style>
#togglers {
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: 1rem;
  gap: 1rem;
}

.svg-icon {
  background-position: center;
  background-repeat: no-repeat;
  display: inline-block;

  padding: 1rem;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
  border-radius: 50%;
  background-color: var(--secondary-color);
  opacity: 0.7;
}

.chat-icon {
  background-image: url('@/assets/bx-chat.svg');
}

.settings-icon {
  background-image: url('@/assets/bxs-cog.svg');
  top: 5rem;
}

.logout-icon {
  background-image: url('@/assets/bx-log-out.svg');
  align-self: center;
  background-color: transparent;
  z-index: 1;
}

.chat-icon {
  z-index: 1;
}

.settings-icon {
  z-index: 4;
}

@media only screen and (max-width: 900px) {
  #togglers {
    right: 0;
  }
}
</style>
