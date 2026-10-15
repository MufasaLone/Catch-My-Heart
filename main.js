const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    movable: false,
    frame: false,
    thickFrame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./src/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.on("app/close", () => {
    app.quit();
});

ipcMain.on("app/minimize", () => {
    win.minimize();
});

let winPopUp;
ipcMain.on("popUp/open", () => {
    winPopUp = new BrowserWindow({
        width: 400,
        height: 300,
        icon: path.join(__dirname, "src/image/Gift.ico"),
        resizable: false,
        frame: false,        // No title bar
        alwaysOnTop: true,   // Appears above your main window
        parent: BrowserWindow.getFocusedWindow(),
        modal: false,        // Don't block main window
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    winPopUp.loadFile("./src/popUp.html");
});

ipcMain.on("popUp/close", () => {
    if (winPopUp) {winPopUp.close()}
});

ipcMain.on("game/resume", () => {
    if (win) {
        win.webContents.send("game/resume");
    }
});

