import { contextBridge, ipcRenderer } from 'electron';
import type { PersistedState } from '../types';
import { APP_VERSION_CHANNEL, STORE_LOAD_CHANNEL, STORE_SAVE_CHANNEL } from './channels';

export function exposeHabitlyApi(): void {
  contextBridge.exposeInMainWorld('habitly', {
    load: (): Promise<PersistedState | null> => ipcRenderer.invoke(STORE_LOAD_CHANNEL),
    save: (state: PersistedState): Promise<void> => ipcRenderer.invoke(STORE_SAVE_CHANNEL, state),
    getVersion: (): Promise<string> => ipcRenderer.invoke(APP_VERSION_CHANNEL),
  });
}
