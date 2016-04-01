var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var globalShortcut = electron.globalShortcut;

// Report crashes to our server.
// require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

function init() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1068, height: 1096, resizable: true, center: true, title: "ppmessage"});
    
    // and load the index.html of the app.
    mainWindow.loadURL("file://" + __dirname + '/index.html');

    // Open the DevTools.
    globalShortcut.register('ctrl+alt+4', function () {
        //mainWindow.webContents.send('global-shortcut', 1);
        mainWindow.webContents.openDevTools();
    });
    
    mainWindow.on("page-title-updated", function (event) {
        event.preventDefault();
    });
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', function (event, hasVisibleWindow) {
    if (hasVisibleWindow) {
        return;
    }
    init();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', init);
