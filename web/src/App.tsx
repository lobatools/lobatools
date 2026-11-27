import { Desktop } from './shell/Desktop'
import { SettingsProvider } from './system/SettingsContext'
import { WindowManagerProvider } from './system/WindowManager'

export function App() {
  return (
    <SettingsProvider>
      <WindowManagerProvider>
        <Desktop />
      </WindowManagerProvider>
    </SettingsProvider>
  )
}
