let currentSound;
let currentStation = null;

// Carica stazioni da JSON
//fetch(chrome.runtime.getURL('stations.json'))
fetch('https://raw.githubusercontent.com/Beta-J23/Cloud_files/refs/heads/main/Radio_stations.json')
  .then(res => res.json())
  .then(stations => {
    const select = document.getElementById('stationSelect');
    stations.forEach(station => {
      const opt = new Option(station.name, station.url);
      select.add(opt);
    });
  });

// Un solo listener
document.getElementById('playBtn').onclick = () => {
  const url = document.getElementById('stationSelect').value;
  chrome.runtime.sendMessage({ play: true, url: url });
};

document.getElementById('stopBtn').onclick = () => {
  chrome.runtime.sendMessage({ stop: true });
};