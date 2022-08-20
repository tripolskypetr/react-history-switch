import { BrowserHistory, MemoryHistory, HashHistory } from 'history'

import ISwitchItem from './ISwitchItem'

export interface ISwitchProps {
  items: ISwitchItem[]
  fallback?: (e: Error) => void
  history?: BrowserHistory | MemoryHistory | HashHistory
  Forbidden?: React.ComponentType<any>
  NotFound?: React.ComponentType<any>
  Loader?: React.ComponentType<any>
  Error?: React.ComponentType<any>
  onLoadStart?: () => void
  onLoadEnd?: (isOk?: boolean) => void
  throwError?: boolean
}

export default ISwitchProps
