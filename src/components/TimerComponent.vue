<template>
  <div id="timer">
    <div class="timer-options not-selectable" v-if="timerStore.stopped">
      <span class="timer-option" @click="startLongBreak"
        >Long Break ({{ settingsStore.longBreak }}min)</span
      >
      <span class="timer-option" @click="startShortBreak"
        >Short Break ({{ settingsStore.shortBreak }}min)</span
      >
      <span class="timer-option" @click="startSession"
        >Session ({{ settingsStore.session }}min)</span
      >
    </div>
    <div class="countdown" v-else>
      <p class="quote">{{ settingsStore.quote }}</p>
      <div class="time not-selectable">
        {{ formatTime(count) }}
      </div>
      <div class="controls not-selectable" v-if="timerStore.paused">
        <span @click="resume">resume</span>
        <span @click="reset">reset</span>
        <span @click="stop">stop</span>
      </div>
      <div class="controls not-selectable" v-else>
        <span @click="pause">pause</span>
      </div>
    </div>
    <div class="users">
      <span class="user" v-for="user in data.users">{{ user }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";

import { useGlobalStore } from "@s/global";
import { useSettingsStore } from "@s/settings";
import { useTimerStore } from "@s/timer";
import { formatTime } from "@/utils/formatTime";

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const timerStore = useTimerStore();

let data = reactive({
  users: [],
});

const count = ref(0);
const tempDuration = ref(0);

const startSession = async () => {
  timerStore.resting = false;
  timerStore.paused = false;
  timerStore.stopped = false;

  tempDuration.value = count.value = settingsStore.session * 60;
  globalStore.socket.emit("countdown:start", {
    duration: count.value,
    isRest: false,
  });
};

const startLongBreak = () => {
  timerStore.resting = true;
  timerStore.paused = false;
  timerStore.stopped = false;

  tempDuration.value = count.value = settingsStore.longBreak * 60;
  globalStore.socket.emit("countdown:start", {
    duration: count.value,
    isRest: true,
  });
};

const startShortBreak = () => {
  tempDuration.value = count.value = settingsStore.shortBreak * 60;
  globalStore.socket.emit("countdown:start", {
    duration: count.value,
    isRest: true,
  });

  timerStore.resting = true;
};

const pause = () => {
  globalStore.socket.emit("countdown:pause", {
    timeLeft: count.value,
  });
};

const resume = () => {
  timerStore.paused = false;
  globalStore.socket.emit("countdown:resume");
};

const reset = () => {
  timerStore.paused = false;
  globalStore.socket.emit("countdown:reset");
};

const stop = () => {
  globalStore.socket.emit("countdown:stop");
};

onMounted(() => {
  globalStore.socket.on("roomUsers", ({ users: newUsers }) => {
    console.log(newUsers);
    data.users = newUsers;
  });

  globalStore.socket.on("countdown:update", ({ count: newCount, rest }) => {
    timerStore.stopped = false;
    timerStore.paused = false;
    timerStore.resting = rest;
    count.value = newCount;
    document.title = `${formatTime(count.value)}`;
    if (count.value === 0) {
      // Show toast
      if (timerStore.resting) {
        globalStore.toast({
          title: "Break is over",
          message: "Got some rest? Time to go back to work!",
          buttonLabel: "Let's go!",
        });
      } else {
        globalStore.toast({
          title: "Congrats on completing your session!!",
          message:
            "Take a break, talk to your friends about what you did and what are you planning to do next session.",
          buttonLabel: "Take a break",
        });
        timerStore.resting = true;
      }

      timerStore.stopped = true;
      timerStore.paused = true;
      document.title = "Study Buddies";
      playSound();
    }
  });

  globalStore.socket.on("countdown:paused", () => {
    timerStore.paused = true;
  });

  globalStore.socket.on("countdown:stopped", () => {
    timerStore.stopped = true;
    timerStore.resting = true;
    document.title = "Study Buddies";
  });
});

const playSound = () => {
  const audio = new Audio(require("../assets/notification-sound.wav"));
  audio.play();
};
</script>

<style>
#timer {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

#timer .time {
  padding-top: 3rem;
  font-size: 4.5rem;
}

#timer .quote {
  font-size: 1rem;
}

.controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.controls > * {
  padding: 0.5rem;
  width: 100%;
}

.controls > *:hover {
  cursor: pointer;
  background-color: var(--primary-color);
  color: var(--bg-color);
}

/** Options */
.timer-options {
  display: flex;
  gap: 1rem;
}

.timer-options .timer-option {
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 1.5rem;
}

.timer-options .timer-option:hover {
  background-color: var(--primary-color);
  color: var(--bg-color);
}

/** Users */
/* Tooltip container */
.users {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 1rem;
  max-height: 30vh;
  width: 10rem;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: small;
  text-align: left;
}

.user-icon {
  background-image: url("@/assets/bx-user.svg");
  background-position: center;
  background-repeat: no-repeat;
  display: inline-block;
  height: 0.7rem;
  width: 0.7rem;
}
</style>
