const { ipcRenderer, contextBridge } = require("electron");

const API = {
    window: {
        close: () => ipcRenderer.send("app/close"),
        minimize: () => ipcRenderer.send("app/minimize")
    },
    openPopUp: () => ipcRenderer.send("popUp/open"),
    closePopUp: () => ipcRenderer.send("popUp/close"),
    resumeGame: () => ipcRenderer.send("game/resume"),
    onResumeGame: (callback) => ipcRenderer.on("game/resume", callback)
}

contextBridge.exposeInMainWorld("app", API);