<template>
  <Transition :name="timerStore.computedTransition">
    <div id="chat" v-if="globalStore.showChat && timerStore.resting" ref="chat">
      <main class="chat-main">
        <div :class="messageClass(message)" v-for="message in messages">
          <div class="message-sender" v-if="message.username && !message.info">
            {{ message.username }}
          </div>
          <p
            class="message-text"
            v-for="paragraph in message.text.split(`\n`)"
            :title="message.time"
          >
            {{ paragraph }}
          </p>
        </div>
      </main>
      <div class="chat-form-container">
        <form name="chatForm" id="chat-form" @submit="handleSubmit">
          <input
            ref="messageInput"
            id="msg"
            type="text"
            placeholder="Aa"
            required
            autocomplete="off"
          />
          <span
            id="submit-btn"
            class="svg-icon"
            @click="handleSubmit"
            @touchend="handleSubmit"
          ></span>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick, watch } from "vue";

import { useGlobalStore } from "@s/global";
import { useSettingsStore } from "@s/settings";
import { useTimerStore } from "@s/timer";

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const timerStore = useTimerStore();

const chat = ref(null);

const messageInput = ref(null);

let messages = reactive([]);

const scrollChat = () => {
  if (chat.value) {
    chat.value.querySelector(".chat-main").scrollTo(0, chat.value.scrollHeight);
  }
};

const messageClass = (message) => {
  if (message.info) {
    return "message message-info";
  } else if (message.username) {
    return "message message-incoming";
  } else {
    return "message message-outgoing";
  }
};

const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  const newMessage = messageInput.value.value;
  if (!newMessage) return;

  // Format time hh:mm a
  let time = new Date().toLocaleTimeString();
  time = time.split(":").splice(0, 2).join(":") + " " + time.split(" ")[1].toLowerCase();
  // Append the message to the messages array
  messages.push({
    text: newMessage,
    time,
  });

  // Wait for the next tick to ensure the message is added to the DOM
  await nextTick();

  // Scroll to the bottom of the chat window
  scrollChat();

  // Send message to server
  globalStore.socket.emit("chatMessage", messageInput.value.value);

  // Clear the input field
  messageInput.value.value = "";
};

watch(chat, () => {
  // Scroll to the bottom of the chat window
  scrollChat();
});

onMounted(() => {
  globalStore.socket.emit("joinRoom", {
    username: settingsStore.username,
    room: globalStore.room,
  });

  globalStore.socket.on("message", (msg) => {
    messages.push(msg);
  });
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap");

#chat {
  /* background-color: red; */
  font-family: "Ubuntu", sans-serif;
  padding-top: 1rem;
  width: 40%;
  height: 100%;
  font-family: sans-serif;
  font-size: 0.9rem;
  line-height: 1rem;
  letter-spacing: 0px;
  color: #000;
  float: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-main {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  overflow-x: hidden;
  height: 100%;
}

/** Scrollbar */

*::-webkit-scrollbar,
*::-webkit-scrollbar-thumb {
  width: 26px;
  border-radius: 13px;
  background-clip: padding-box;
  border: 10px solid transparent;
}

*::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 0 10px #00000068;
}

/** Messages */

.chat-main .message-info {
  align-self: center;
  font-size: 0.8rem;
  max-width: fit-content;
  color: #eee;
  text-align: center;
  margin-bottom: 0;
}

.message {
  width: 70%;
  padding: 1rem;
  margin-bottom: 0.3rem;
  padding: 0.5rem;
  word-wrap: break-word;
  letter-spacing: 0.5px;
}

.message-outgoing {
  align-self: flex-end;
  background-color: var(--primary-color);
  border-radius: 1rem;
}

.message-incoming {
  background-color: var(--secondary-color);
  border-radius: 1rem;
}

.message-sender {
  margin-bottom: 0.3rem;
}

.message-sender {
  font-weight: bold;
}

#msg {
  flex: 1;
  border: none;
  background-color: #ddd;
  height: 2rem;
  padding: 0.4rem;
}

/** Chat Form */
.chat-form-container {
  padding: 1rem;
  width: 100%;
  overflow: hidden;
  background: transparent;
  border: none;
  background-color: var(--bg-color);
  z-index: 2;
}

#chat-form {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

#chat-form input {
  padding: 1.3rem 1rem;
  font-size: inherit;
}

#submit-btn {
  height: 2rem;
  padding: 1rem;
  background-image: url("@/assets/bxs-send.svg");
  width: 2rem;
  margin-left: 0.2rem;
  cursor: pointer;
  overflow: hidden;
}

/** Chat animation */
.chat-enter-active {
  animation: bounceInRight 0.5s;
}

.chat-leave-active {
  animation: bounceOutRight 0.5s;
}
</style>
