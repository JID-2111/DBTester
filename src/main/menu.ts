import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import ConnectionService from '../db/service/ConnectionService';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'DB Tester',
      submenu: [
        {
          label: 'About DBTester',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Hide DBTester',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: 'Connect',
      submenu: [
        {
          label: 'New Connection',
          accelerator: 'Command+N',
          selector: '',
          click: () => {
            const service = new ConnectionService();
            service.disconnect();
            this.mainWindow.webContents.executeJavaScript(
              "location.assign('#/newconnection');"
            );
          },
        },
        {
          label: 'Recent Connections',
          accelerator: 'Command+P',
          selector: '',
          click: () => {
            const service = new ConnectionService();
            service.disconnect();
            this.mainWindow.webContents.executeJavaScript(
              "location.assign('#/recentconnection');"
            );
          },
        },
        {
          label: 'Disconnect',
          accelerator: 'Command+D',
          selector: '',
          click: () => {
            const service = new ConnectionService();
            service.disconnect();
            this.mainWindow.webContents.executeJavaScript(
              "location.assign('#/');"
            );
          },
        },
        { type: 'separator' },
        {
          label: 'View History',
          accelerator: 'Command+H',
          selector: '',
          click: () => {
            const service = new ConnectionService();
            service.disconnect();
            this.mainWindow.webContents.executeJavaScript(
              "location.assign('#/history');"
            );
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Read Me',
          accelerator: 'F1',
          click() {
            shell.openExternal('https://github.com/JID-2111/JID-2111#DBTester');
          },
        },
        {
          label: 'Search Issues',
          accelerator: 'F3',
          click() {
            shell.openExternal('https://github.com/JID-2111/JID-2111/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [
      subMenuAbout,
      subMenuFile,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp,
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&Connect',
        submenu: [
          {
            label: 'New Connection',
            accelerator: 'Ctrl+N',
            click: () => {
              const service = new ConnectionService();
              service.disconnect();
              this.mainWindow.webContents.executeJavaScript(
                "location.assign('#/newconnection');"
              );
            },
          },
          {
            label: 'Recent Connections',
            accelerator: 'Ctrl+P',
            click: () => {
              const service = new ConnectionService();
              service.disconnect();
              this.mainWindow.webContents.executeJavaScript(
                "location.assign('#/recentconnection');"
              );
            },
          },
          {
            label: 'Disconnect',
            accelerator: 'Ctrl+D',
            click: () => {
              const service = new ConnectionService();
              service.disconnect();
              this.mainWindow.webContents.executeJavaScript(
                "location.assign('#/');"
              );
            },
          },
          {
            label: 'View History',
            accelerator: 'Ctrl+H',
            click: () => {
              const service = new ConnectionService();
              service.disconnect();
              this.mainWindow.webContents.executeJavaScript(
                "location.assign('#/history');"
              );
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal(
                'https://github.com/JID-2111/JID-2111#stored-procedure-unit-tester'
              );
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/JID-2111/JID-2111/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
