import { defineStore } from "pinia";
import { ref } from "vue";
import { useGlobalStore } from "./global";

export const useSettingsStore = defineStore("settings", () => {
  const username = ref(localStorage.getItem("username") || "Someone");
  const quote = ref(
    localStorage.getItem("quote") || "Don't let yesterday take up too much of today."
  );
  const session = ref(25);
  const shortBreak = ref(5);
  const longBreak = ref(20);

  const globalStore = useGlobalStore();

  const validate = (username, quote, session, shortBreak, longBreak) => {
    if (!username) return { error: "Please enter a username" };
    if (!quote) return { error: "Please enter a quote" };
    if (!session) return { error: "Please enter a session length" };
    if (!shortBreak) return { error: "Please enter a short break length" };
    if (!longBreak) return { error: "Please enter a long break length" };
    if (session > 120) return { error: "Session length must be less than 2 hours" };
    if (shortBreak > 120) return { error: "Short break length must be less than 2 hours" };
    if (longBreak > 120) return { error: "Long break length must be less than 2 hours" };

    if (session < 1) return { error: "Session length must be at least 1 minute" };
    if (shortBreak < 1) return { error: "Short break length must be at least 1 minute" };
    if (longBreak < 1) return { error: "Long break length must be at least 1 minute" };
    return { ok: true };
  };

  const updateSettings = (newUsername, newQuote, newSession, newShortBreak, newLongBreak) => {
    const validation = validate(newUsername, newQuote, newSession, newShortBreak, newLongBreak);
    if (validation.error) return { error: validation.error };

    // Send setttings to the server
    globalStore.socket.emit("settings:res", {
      username: newUsername.trim(),
      session: session.value === newSession ? null : newSession,
      shortBreak: shortBreak.value === newShortBreak ? null : newShortBreak,
      longBreak: longBreak.value === newLongBreak ? null : newLongBreak,
    });

    username.value = newUsername;
    quote.value = newQuote;
    localStorage.username = newUsername;
    localStorage.quote = newQuote;
    session.value = newSession;
    shortBreak.value = newShortBreak;
    longBreak.value = newLongBreak;

    return { ok: true };
  };

  return {
    username,
    quote,
    session,
    shortBreak,
    longBreak,
    updateSettings,
  };
});
