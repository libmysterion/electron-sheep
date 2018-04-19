const { ipcRenderer } = require('electron');
ipcRenderer.on('make-a-sheep', (event, arg) => {
     window.location.href = 'http://google.com';
});