const { app, BrowserWindow } = require("electron");
const { updateElectronApp } = require("update-electron-app");
updateElectronApp();

app.whenReady().then(() => {
  const window = new BrowserWindow({
    fullscreen: true,
  });

  window.loadFile("./src/index.html");
});
