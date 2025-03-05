const { app, BrowserWindow, ipcMain } = require('electron');

let win; // Declare win globally

function createWindow() {
     win = new BrowserWindow({
          width: 450,
          height: 600,
          autoHideMenuBar: true,
          frame: false,
          resizable: false,
          webPreferences: {
              nodeIntegration: true, // ✅ Enable require() in renderer.js
              contextIsolation: false, // ✅ Allow ipcRenderer to work correctly
          },
      });
      

    win.loadFile('./src/index.html');

    win.on('closed', () => {
        win = null; // Prevent memory leaks
    });

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('close-window', () => {
     if (win) {
         win.close();  // Close the window
     }
 });
 
 ipcMain.on('min-window', () => {
     if (win) {
         win.minimize();  // Minimize the window
     }
 });
 
