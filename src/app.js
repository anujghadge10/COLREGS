// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const { updateElectronApp } = require("update-electron-app");
updateElectronApp();

const debug = process.env.DEBUG;

app.on("ready", ready);
app.on("window-all-closed", closeWindow);
app.on("activate", activate);

function ready() {
  appWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/dist/index.html"),
      protocol: "file",
      slashes: true,
    })
  );
}
