# Habitly — Security Notes

Habitly is a local-only habit tracker: no network calls, no accounts, no
remote content. The checks below cover the main Electron attack surface.

## Renderer isolation (the big one)

`src/main.ts` creates the `BrowserWindow` with only a `preload` path set —
no `nodeIntegration`, `contextIsolation`, or `sandbox` overrides. That means
Electron's current secure defaults are in effect:

- `contextIsolation: true` — renderer JS cannot reach Node/Electron internals directly.
- `nodeIntegration: false` — no `require()`/`process` access in the renderer.
- `sandbox: true` — preload + renderer run in an OS-level sandbox.

**Rule going forward:** never set any of these three to the insecure value.
If a future feature (e.g. file export) needs Node APIs, expose a narrow
function from `src/preload.ts` via `contextBridge.exposeInMainWorld`, never
flip `nodeIntegration`/`contextIsolation`.

## Preload bridge (electron-store)

`src/preload.ts` exposes a `window.habitly` API backed by IPC
(`ipcRenderer.invoke('habitly:load' | 'habitly:save', ...)`). It does **not**
expose `ipcRenderer` itself, ports, or `require` — only two narrow,
single-purpose functions. The main-process handlers
(`src/lib/store/main-store.ts`) only read/write the app's own `electron-store`
file; they don't `eval`, run shell commands, or touch arbitrary paths.

## Content loaded into the window

The window only ever loads one of two things:
- the local Vite dev server (`MAIN_WINDOW_VITE_DEV_SERVER_URL`, dev only), or
- the app's own bundled `index.html` from the asar (production).

No `loadURL` to third-party/remote origins, no `<webview>`, no `BrowserWindow`
popups. `webSecurity`, `allowRunningInsecureContent`, and
`experimentalFeatures` are all left at their secure defaults (not disabled).

## Content-Security-Policy

`index.html` sets a CSP meta tag:
```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self' data:; connect-src 'self' ws://localhost:*;
```
This blocks any injected/remote script or stylesheet from executing, even if
something slipped XSS into rendered content. `connect-src ws://localhost:*`
is only needed for the Vite dev server's HMR socket; it has no effect on the
packaged production build.

## Packaging

`forge.config.ts` enables the Electron Fuses that matter most for a shipped
app: `RunAsNode: false`, `EnableNodeCliInspectArguments: false`,
`OnlyLoadAppFromAsar: true`, `EnableEmbeddedAsarIntegrityValidation: true`,
`EnableCookieEncryption: true`. Together these stop the packaged `.app` from
being re-launched as a generic Node process or having its asar swapped/patched
post-build.

## Data

All habit data lives in a local `electron-store` JSON file under the OS user
data directory — never transmitted anywhere, no third-party SDKs, no
telemetry. There is no remote attack surface to lock down because there is no
remote anything.

## Out of scope (no code here yet)

- Code signing / notarization for distribution outside the Mac App Store —
  needed before a "Download for macOS" button ships a real binary that won't
  trip Gatekeeper warnings.
- Auto-update — not implemented; if added later, it must verify update
  signatures (Squirrel.Mac / `electron-updater`) rather than fetching and
  running arbitrary code.
