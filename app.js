// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater, AppUpdater } = require("electron-updater");
const log = require("electron-log");
log.transports.file.resolvePathFn = () =>
  path.join(
    "C:Usersshivendra.kOneDrive - Element TreeRORRORautoupdate",
    "logs/main.log"
  );

const debug = process.env.DEBUG;

let appWindow;

app.on("ready", ready);
app.on("window-all-closed", closeWindow);
app.on("activate", activate);
app.on("createWindow", createWindow);

function ready() {
  const mainScreen = screen.getPrimaryDisplay();
  const dimensions = mainScreen.size;
  autoUpdater.checkForUpdates();

  appWindow = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    frame: true, // Set frame to true to show the minimize, maximize, and close buttons
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Hide menu bar
  appWindow.setMenuBarVisibility(false);

  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/dist/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // Open DevTools only if in debug mode
  if (debug) {
    appWindow.webContents.openDevTools();
  }
}

function activate() {
  if (appWindow === null) {
    ready();
  }
}

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    icon: "./icon/language_markdown_outline_icon_139425.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
}

function closeWindow() {
  if (process.platform !== "darwin") {
    app.quit();
  }

  process.exit(0);
}

function sendStatusToWindow(text) {
  const aboutWindow = openAboutWindow();
  log.info(text);
  aboutWindow.webContents.send("update-message", text);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", () => {
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", () => {
  sendStatusToWindow("Update not available.");
});

autoUpdater.on("error", (err) => {
  sendStatusToWindow("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;

  log_message = log_message + " - Downloaded " + progressObj.percent + "%";

  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";

  sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", () => {
  sendStatusToWindow("Update downloaded. Quitting and installing.");
});
