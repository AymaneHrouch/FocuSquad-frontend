<template>
  <UsernameInput v-if="!settingsStore.username" />
  <template v-else>
    <ToastComponent />
    <TogglersComponent />
    <SettingsComponent />
    <TimerComponent />
    <ChatComponent />
  </template>
</template>

<script setup>
import { onMounted } from "vue";

import ToastComponent from "./ToastComponent.vue";
import ChatComponent from "@c/ChatComponent.vue";
import TimerComponent from "@c/TimerComponent.vue";
import SettingsComponent from "@c/settingsComponent.vue";
import TogglersComponent from "@c/TogglersComponent.vue";
import UsernameInput from "@c/UsernameInput.vue";

import { useGlobalStore } from "@s/global";
import { useSettingsStore } from "@s/settings";

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();

onMounted(() => {
  globalStore.socket.on("countdown:state", (state) => {
    timerStore[state] = true;
  });

  /**
   * When a new user joins the room, they send settings:req event through the server
   * The already connected users send settings:res to the server to sync the settings
   * with new user
   */
  globalStore.socket.on("settings:req", () => {
    globalStore.socket.emit("settings:res", {
      session: settingsStore.session,
      shortBreak: settingsStore.shortBreak,
      longBreak: settingsStore.longBreak,
      sync: true,
    });
  });

  /**
   * The server gets the settings from settings:res event, then it sends it through
   * settings:update event to all the connected users
   *
   * Or when a user change the settings using the settings component, the server
   * sends the new settings to all the connected users using settings:update event
   */
  globalStore.socket.on("settings:update", ({ session, shortBreak, longBreak }) => {
    // if some settings aren't changed, we keep using the old settings
    settingsStore.session = session || settingsStore.session;
    settingsStore.shortBreak = shortBreak || settingsStore.shortBreak;
    settingsStore.longBreak = longBreak || settingsStore.longBreak;
  });
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anek+Telugu:wght@500&display=swap");

:root {
  --bg-color: #5a19d3;
  --text-color: #dadada;
  --primary-color: #c4c4c4;
  --secondary-color: #dddddd;
  --input-color: #e7c2ef;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

input:focus {
  outline: none;
}

input {
  border: none;
  border-radius: 1rem;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: "Anek Telugu", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  letter-spacing: 1px;
}

#app {
  display: flex;
  height: 100%;
  width: 100%;
}

.not-selectable {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}

@media only screen and (max-width: 900px) {
  #chat {
    width: 100%;
    position: absolute;
    right: 0;
    background: rgb(0, 0, 0, 0.3);
  }

  #timer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: 100%;
    justify-content: flex-start;
    padding-top: 9rem;
  }

  .timer-options {
    flex-direction: column;
  }

  .timer-options .timer-option,
  .controls > * {
    width: 100vw;
  }

  .modal-wraper {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .chat-icon,
  .settings-icon {
    height: 1rem;
    width: 1rem;
  }

  .quote {
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }
}

.btn {
  color: var(--bg-color);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  float: left;
  max-width: max-content;
  background-color: #be5ed4;
  border-radius: 1rem;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  cursor: pointer;
  background-color: #ae36c9;
  color: #000;
  outline: 2px solid #000;
}

.btn:hover {
  background-color: #be5ed4;
}
</style>
