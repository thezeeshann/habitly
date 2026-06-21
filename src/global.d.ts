import type { PersistedState } from './lib/types';

declare global {
  interface Window {
    habitly: {
      load: () => Promise<PersistedState | null>;
      save: (state: PersistedState) => Promise<void>;
    };
  }
}

export {};
