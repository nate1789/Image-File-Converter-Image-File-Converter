const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
const destinationFolder = "C:\\Users\\Person\\source\\repos\\Signature Image Tool\\images";

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile('index.html');
});

ipcMain.on('move-file', (event, filePath) => {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
        event.reply('move-file-response', { success: false, message: "Invalid file path received." });
        return;
    }

    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
    }

    const fileName = path.basename(filePath);
    const destinationPath = path.join(destinationFolder, fileName);

    fs.rename(filePath, destinationPath, (err) => {
        if (err) {
            event.reply('move-file-response', { success: false, message: err.message });
        } else {
            event.reply('move-file-response', { success: true, message: 'File moved successfully!' });
        }
    });
});
