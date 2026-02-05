let currentAudio = null;

chrome.runtime.onMessage.addListener(({ play, url }) => {
     if (stop) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
  }
  if (play && url) {
    // Ferma l'audio corrente
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    // Crea e riproduci il nuovo audio
    currentAudio = new Audio(url);
    currentAudio.play();
  }
});