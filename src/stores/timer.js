import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const paused = ref(true);
  const stopped = ref(true);
  const resting = ref(true);

  const computedTransition = computed(() => {
    return resting.value && "chat";
  });

  return {
    paused,
    stopped,
    resting,
    computedTransition,
  };
});
