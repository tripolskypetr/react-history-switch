export interface ISwitchItem {
  path: string
  element?: React.ComponentType<any>
  guard?: () => boolean | Promise<boolean>
  prefetch?: (
    params: Record<string, any>
  ) => Record<string, any> | Promise<Record<string, any>>
  unload?: (params: Record<string, any>) => Promise<void> | void
  redirect?: string | ((params: Record<string, any>) => string | null)
}

export default ISwitchItem
