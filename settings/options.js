const saveList = () => {
  const name = document.getElementById('listName').value;
  const url = document.getElementById('listUrl').value;
  if (!name || !url) return;

  fetch(url).then(res => res.json()).then(stations => {
    chrome.storage.local.set({ [name]: stations }, () => {
      loadListNames();
      document.getElementById('listName').value = '';
      document.getElementById('listUrl').value = '';
    });
  }).catch(err => alert('Invalid URL'));
};

const loadListNames = () => {
  chrome.storage.local.get(null, (items) => {
    const select = document.getElementById('savedLists');
    select.innerHTML = '';
    const localOpt = new Option('Local List', 'Local_List');
    select.add(localOpt);
    Object.keys(items).filter(k => Array.isArray(items[k])).forEach(name => {
      if (name !== 'Local_List') { 
        const opt = new Option(name, name);
        select.add(opt);
      }
    });
  });
};

document.getElementById('savedLists').addEventListener('change', (e) => {
  const name = e.target.value;
  if (name === 'Local_List') {
    fetch(chrome.runtime.getURL('utils/stations.json'))
      .then(res => res.json())
      .then(data => {
        document.getElementById('jsonPreview').textContent = JSON.stringify(data, null, 2);
      });
  } else {
    chrome.storage.local.get([name], (res) => {
      const data = res[name];
      document.getElementById('jsonPreview').textContent = JSON.stringify(data, null, 2);
    });
  }
});

document.getElementById('listUrl').addEventListener('input', async () => {
  const url = document.getElementById('listUrl').value;
  const preview = document.getElementById('stationPreview');
  preview.innerHTML = '';
  if (!url) return;
  try {
    const res = await fetch(url);
    const stations = await res.json();
    stations.forEach(station => {
      const p = document.createElement('div');
      p.textContent = station.name;
      preview.appendChild(p);
    });
  } catch (err) {
    preview.textContent = 'Invalid URL or JSON';
  }
});

document.getElementById('saveList').addEventListener('click', saveList);

document.getElementById('loadList').addEventListener('click', () => {
  const name = document.getElementById('savedLists').value;
  chrome.storage.local.get([name], (res) => {
    if (name === 'Local_List') {
      fetch(chrome.runtime.getURL('utils/stations.json'))
        .then(res => res.json())
        .then(stations => {
          chrome.storage.local.set({ currentList: 'Local_List', 'Local_List': stations });
        });
    } else {
      chrome.storage.local.set({ currentList: name });
    }
  });
});

document.getElementById('deleteList').addEventListener('click', () => {
  const name = document.getElementById('savedLists').value;
  if (name === 'Custom_List') {
    alert("Cannot delete custom list");
    return;
  }
  chrome.storage.local.remove(name, loadListNames);
});

chrome.storage.onChanged.addListener(loadListNames);

loadListNames();