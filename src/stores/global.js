import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { io } from 'socket.io-client';

export const useGlobalStore = defineStore('global', () => {
  // Global socket
  const socket = io(process.env.VUE_APP_API_URL, {
    transports: ['websocket'],
  });

  const room = new URLSearchParams(location.search).get('room');

  const showChat = ref(true);
  const showSettings = ref(false);
  const showToast = ref(false);

  let toastData = reactive({
    title: '',
    message: '',
    buttonLabel: 'Close',
  });

  const toggleChat = () => {
    showChat.value = !showChat.value;
  };

  const toggleSettings = () => {
    showSettings.value = !showSettings.value;
  };

  const toast = (data) => {
    for (let key in data) {
      toastData[key] = data[key] || toastData[key];
    }

    showToast.value = true;
  };

  return {
    socket,
    room,
    showChat,
    showSettings,
    showToast,
    toastData,
    toggleChat,
    toggleSettings,
    toast,
  };
});
