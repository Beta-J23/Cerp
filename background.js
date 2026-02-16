async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: '../utils/offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Riproduzione radio in background'
  });
}

/*
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.play) {
    await createOffscreen();
    chrome.runtime.sendMessage({ play: true, url: request.url });
    return;
  }
  if (request.action === 'addStation') {
    chrome.storage.local.get(['Custom_List'], (res) => {
      const list = res['Custom_List'] || [];
      list.push({ name: request.name, url: request.url });
      chrome.storage.local.set({ 'Custom_List': list }, () => {
        // Ensure it's saved
        console.log('Custom_List saved:', list);
        alert("Custom_List saved:'", list);
      });
    });
  }
});*/

chrome.runtime.onMessage.addListener(async (request) => {
  await createOffscreen();
  if (request.play) {
    chrome.runtime.sendMessage({ play: true, url: request.url });
  }
});