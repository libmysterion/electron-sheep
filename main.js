const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const { ipcMain } = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const debug = false;


function createWindow() {
    // Create the browser window.
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width,
        height,
        frame: debug,
        transparent: !debug,
        alwaysOnTop: !debug,
        backgroundThrottling: false,
        focusable: debug
    });
    //mainWindow.setIgnoreMouseEvents(true, { forward: true });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    debug && mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });


   // var makeSheepWindow = new BrowserWindow({ x: 1000, y: 50, width: 100, height: 100, frame: false, alwaysOnTop: true });

    // and load the index.html of the app.
    // makeSheepWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, 'makeSheep.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))

   // const sheepWindows = {};
    // ipcMain.on('make-sheep', (event, arg) => {

    //     var sheepWindow = new BrowserWindow({
    //         x: 0,
    //         y: 0,
    //         width: 40,
    //         height: 40,
    //         transparent: false,
    //         frame: true,
    //         parent: mainWindow,
    //         webPreferences: {
    //             preload: path.join(__dirname, 'sheep-preload.js'),
    //             nodeIntegration: false
    //         }
    //     });
    //     sheepWindow.show();
    //     //, frame: false, alwaysOnTop: true, transparent: true });

    //     sheepWindow.loadURL('about:blank');

    //     // ipcMain.once('made-a-sheep', (event, { id }) => {
    //     //     sheepWindows[id] = sheepWindow;
    //     // });
    //    // mainWindow.webContents.send('make-a-sheep');
    // })

    // ipcMain.on('update-sheep-positions', (event, { positions }) => {
    //     //{id, x, y}
    //     positions.forEach(({id, x, y}) => {
    //         const sheepWindow = sheepWindows[id];

    //         if(sheepWindow){
    //            // console.log('moving it');
    //            // sheepWindow.setPosition(x, y);
    //         }
    //     });
    // });


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
