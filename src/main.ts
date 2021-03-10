const psList = require('ps-list');

import { app, BrowserWindow } from 'electron';
import path from 'path';

// セキュアな Electron の構成
// 参考: https://qiita.com/pochman/items/64b34e9827866664d436

const createWindow = (): void => {
  // レンダープロセスとなる、ウィンドウオブジェクトを作成する。
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
    },
  });

  // 読み込む index.html。
  // tsc でコンパイルするので、出力先の dist の相対パスで指定する。
  win.loadFile('./index.html');

  // 開発者ツールを起動する
  win.webContents.openDevTools();

  win.on('close', () => console.log('Browser Window Close'));
  win.on('closed', () => console.log('Browser Window Closed'));
};

// Electronの起動準備が終わったら、ウィンドウを作成する。
app.whenReady().then(createWindow);


// すべての ウィンドウ が閉じたときの処理
app.on('window-all-closed', () => {
  app.on('will-quit', () => {
    console.log('= before-quit =========================');

    (async () => {
        (await psList()).forEach((el: string) => console.log(el));
    })();

  });

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS では、ウインドウが閉じてもメインプロセスは停止せず
  // ドックから再度ウインドウが表示されるようにする。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
