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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


let processes: {[key: number]: any} = {};
let getProcessList = () => {
  (async () => {
    (await psList()).forEach(
      (el: any) => {
        let reg = /.*ruby.*/
        if (reg.test(el.name)){
	  processes[el.pid] = el;
          //process.kill(el.pid, 'SIGTERM');
        }
      }
    )
  })();
}

setInterval(getProcessList, 2000);

setInterval(()=>{console.log(processes)}, 1000)



/*
app.on('will-quit', (event) => {
  console.log("= will-quit ============================");
  event.preventDefault();
  let processes: Array<number> = new Array();
  (async () => {
    (await psList()).forEach(
      (el: any) => {
        let reg = /ruby/;
        if (reg.test(el.cmd)){
          processes.push(el);
          console.log(el);
          process.kill(el.pid, 'SIGTERM');
        }
      })
  })();

  console.log(processes);

  app.quit();
});
*/

app.on('activate', () => {
  // macOS では、ウインドウが閉じてもメインプロセスは停止せず
  // ドックから再度ウインドウが表示されるようにする。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
