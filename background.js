async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Riproduzione radio in background'
  });
}

chrome.runtime.onMessage.addListener(async (request) => {
  await createOffscreen();
  if (request.play) {
    chrome.runtime.sendMessage({ play: true, url: request.url });
  }
});