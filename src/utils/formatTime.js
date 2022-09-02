export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const padTo2Digits = (num) => num.toString().padStart(2, "0");
  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};
