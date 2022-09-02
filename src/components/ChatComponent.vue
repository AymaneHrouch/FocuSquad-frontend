<template>
  <Transition :name="timerStore.computedTransition">
    <div id="chat" v-if="globalStore.showChat && timerStore.resting">
      <main class="chat-main">
        <div
          :class="`message message-${message.username ? `incoming` : `outgoing`}`"
          v-for="message in messages"
        >
          <div class="message-sender" v-if="message.username">{{ message.username }}</div>
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
import { onMounted, reactive, ref, nextTick } from 'vue';

import { useGlobalStore } from '@s/global';
import { useSettingsStore } from '@s/settings';
import { useTimerStore } from '@s/timer';

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const timerStore = useTimerStore();

const messageInput = ref(null);

let messages = reactive([]);

const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  const newMessage = messageInput.value.value;
  if (!newMessage) return;

  // Format time hh:mm a
  let time = new Date().toLocaleTimeString();
  time = time.split(':').splice(0, 2).join(':') + ' ' + time.split(' ')[1].toLowerCase();
  // Append the message to the messages array
  messages.push({
    text: newMessage,
    time,
  });

  // Wait for the next tick to ensure the message is added to the DOM
  await nextTick();

  // Scroll to the bottom of the chat window
  const chat = document.querySelector('#chat .chat-main');
  chat.scrollTo(0, chat.scrollHeight);

  // Send message to server
  globalStore.socket.emit('chatMessage', messageInput.value.value);

  // Clear the input field
  messageInput.value.value = '';
};

onMounted(() => {
  globalStore.socket.emit('joinRoom', {
    username: settingsStore.username,
    room: globalStore.room,
  });

  globalStore.socket.on('message', (msg) => {
    messages.push(msg);

    // Scroll to the bottom of the chat
    const chat = document.querySelector('#chat .chat-main');
    chat.scrollTo(0, chat.scrollHeight);
  });
});
</script>

<style>
#chat {
  /* background-color: red; */
  padding-top: 1rem;
  width: 40%;
  height: 100%;
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 1rem;
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

.message {
  width: 70%;
  background-color: green;
  margin-bottom: 0.3rem;
  padding: 0.5rem 0.2rem;
  word-wrap: break-word;
}

.message-outgoing {
  align-self: flex-end;
  background-color: var(--primary-color);
}

.message-incoming {
  background-color: var(--secondary-color);
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
}

#chat-form {
  display: flex;
  width: 100%;
}

#submit-btn {
  height: 2rem;
  padding: 0;
  background-image: url('@/assets/bxs-send.svg');
  width: 2rem;
  margin-left: 0.2rem;
  cursor: pointer;
  border-radius: 0;
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
