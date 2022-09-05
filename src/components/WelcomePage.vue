<template>
  <main>
    <form class="modal" @submit="submit">
      <h2>Welcome to Study Buddies</h2>
      <p>Create or join a study room</p>
      <input autofocus type="text" placeholder="room-name" ref="generator" />
      <span id="generate_room" @click="generateRandomRoom">generate random</span>
      <button class="btn">Go!!</button>
    </form>
  </main>
</template>

<script setup>
import { ref } from "vue";

const generator = ref(null);

const randomString = () => Math.random().toString(36).substring(2, 15);

const generateRandomRoom = () => {
  generator.value.value = randomString();
};

const submit = e => {
  e.preventDefault();
  // Redirect to the room
  const room = generator.value.value;
  if (room) {
    window.location.href = `?room=${room}`;
  } else {
    window.location.href = `?room=${randomString()}`;
  }
};
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

main .modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 2rem;
  /* background-color: red; */
  width: 20rem;
  gap: 0.5rem;
}

.modal input {
  align-self: center;
  height: 2rem;
  width: 100%;
  font-size: 1.3rem;
  padding: 1.2rem;
}

#generate_room {
  cursor: pointer;
  user-select: none;
}

#generate_room:hover {
  text-decoration: underline;
}

.btn {
  font-size: 1.2rem;
  letter-spacing: 1px;
  font-weight: bold;
}
</style>
