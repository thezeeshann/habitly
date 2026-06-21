import { ipcMain } from 'electron';
import Store from 'electron-store';
import type { PersistedState } from '../types';
import { STORE_LOAD_CHANNEL, STORE_SAVE_CHANNEL } from './channels';

export function registerStoreHandlers(): void {
  const store = new Store<{ state?: PersistedState }>();

  ipcMain.handle(STORE_LOAD_CHANNEL, (): PersistedState | null => store.get('state') ?? null);
  ipcMain.handle(STORE_SAVE_CHANNEL, (_event, state: PersistedState) => {
    store.set('state', state);
  });
}
