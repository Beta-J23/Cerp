let currentAudio = null;
let hls = null;
const config = {
  backBufferLength: 10, // secondi
  maxBufferLength: 30
};

chrome.runtime.onMessage.addListener(({ play, stop, url, name }) => {
  if (stop) {
     if (hls) hls.destroy();
     if (currentAudio) currentAudio.pause();
       //currentAudio.src = '';
       currentAudio = null;
       hls = null;
    }
  if (play && url) {
    // Ferma l'audio corrente
    if (hls) hls.destroy;
    if (currentAudio) 
      currentAudio.pause();
    currentAudio = new Audio();
    // Crea e riproduci il nuovo audio
    if (url.endsWith('.m3u8') || url.endsWith('.m3u'))
      {
        if (Hls.isSupported()){
          hls = new Hls(config);
          hls.loadSource(url);
          hls.attachMedia(currentAudio);
          hls.on(Hls.Events.MANIFEST_PARSED, () => currentAudio.play());
        }
      }
      else {
        currentAudio.src = url;
        currentAudio.play();
        }
  }
});