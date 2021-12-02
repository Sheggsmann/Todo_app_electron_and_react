const path = require("path");
const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
const db = require("./db");

// const isDev = require("electron-is-dev");
const isDev = false;
const isMac = process.platform === "darwin";

process.env.NODE_ENV = "production";

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

app.whenReady().then(() => createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: isMac ? "Command+Q" : "Control+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (isMac) {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "producon") {
  menuTemplate.push({
    label: "Developer Tools",
    accelerator: isMac ? "Command+I" : "Control+I",
    submenu: [
      {
        label: "Toggle DevTools",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

ipcMain.on("get:todos", async () => {
  await db.createDb();
  console.log("Fetching Todos");
  const todoList = [];
  const todos = await db.getTodo();
  todos.map((todo) => todoList.push(todo["dataValues"]));
  win.webContents.send("todo:list", todoList);
});

ipcMain.on("create:todo", async (e, name) => {
  const todo = await db.createTodo(name);
  win.webContents.send("todo:created", todo["dataValues"]);
});

ipcMain.on("update:todo", async (e, data) => {
  await db.updateTodo(parseInt(data.id), data.completed);
});

ipcMain.on("delete:todo", async (e, data) => {
  await db.deleteTodo(data.id);
});

ipcMain.on("delete:completed", async (e) => {
  await db.deleteCompleted();
});
