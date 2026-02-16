let currentSound;
let currentStation = null;

/*
const updateStationSelect = (stations) => {
  const select = document.getElementById('stationSelect');
  select.innerHTML = '';
  if (!stations || !Array.isArray(stations)) return;
  stations.forEach(station => {
    const opt = new Option(station.name, station.url);
    select.add(opt);
  });
};*/

document.addEventListener('DOMContentLoaded', () => {
  const updateStationSelect = (stations) => {
    const select = document.getElementById('stationSelect');
    select.innerHTML = '';
    if (!stations || !Array.isArray(stations)) return;
    stations.forEach(station => {
      const opt = new Option(station.name, station.url);
      select.add(opt);
    });

    // Add last played as first option
    chrome.storage.local.get(['lastPlayed'], (res) => {
      if (res.lastPlayed) {
        const opt = new Option(`${res.lastPlayed}`, '', false, false);
        opt.style.color = '#8d4eeb';
        select.insertBefore(opt, select.firstChild);
        select.selectedIndex = 0;
      }
    });
  };

  // Load saved list
  chrome.storage.local.get(['currentList'], (res) => {
    const listName = res.currentList || 'default';
    if (listName !== 'default') {
      chrome.storage.local.get([listName], (items) => {
        updateStationSelect(items[listName]);
      });
    }
  });

  // Play button
  document.getElementById('playBtn').onclick = () => {
    const select = document.getElementById('stationSelect');
    const url = select.value;
    const stationName = select.options[select.selectedIndex].text;
    chrome.storage.local.set({ lastPlayed: stationName });
    chrome.runtime.sendMessage({ play: true, url });
  };

  // Stop button
  document.getElementById('stopBtn').onclick = () => {
    chrome.runtime.sendMessage({ stop: true });
  };

  /*

  // + button
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const isRadioBrowser = tabs[0]?.url?.includes('radio-browser.info/history');
    if (isRadioBrowser) {
      document.getElementById('addBtn').style.display = 'block';
      document.getElementById('addBtn').onclick = () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getStationData' });
        console.log("+ button pressed, sending Getstationdata");
        //alert('buttonpressed');
      };
    }
  });

  document.getElementById('addBtn').onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content/content.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Script injection failed:', chrome.runtime.lastError);
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getStationData' });
    });
  });
};*/

  // Settings button
  document.getElementById('settingsBtn').onclick = () => {
    chrome.runtime.openOptionsPage();
  };
});   