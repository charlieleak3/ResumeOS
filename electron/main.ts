import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { LocalProfileDatabase } from '../src/main/db';

let mainWindow: BrowserWindow | null = null;
let db: LocalProfileDatabase | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'ResumeOS',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  db = new LocalProfileDatabase(app.getPath('userData'));

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  // IPC Handlers for Local Data Isolation
  ipcMain.handle('load-profile', async (_, profileId: string) => {
    return db?.loadProfileData(profileId);
  });

  ipcMain.handle('save-profile', async (_, { profileId, profile, repository, snapshots }) => {
    db?.saveProfileData(profileId, profile, repository, snapshots);
    return true;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});