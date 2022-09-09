import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    procedures: {
      ipcRenderer: {
        fetchProcedures(): Promise<Map<string, string[]>>;
        fetchDatabases(): Promise<string[]>;
      };
    };
  }
}

export {};
