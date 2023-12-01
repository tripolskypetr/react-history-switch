import {
  BrowserHistory,
  HashHistory,
  Location,
  MemoryHistory,
  Update
} from 'history'
import { Key, pathToRegexp } from 'path-to-regexp'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import ErrorDefault from './Error'
import FetchView from './FetchView'
import ForbiddenDefault from './Forbidden'
import HistoryContext from '../context/HistoryContext'
import LoaderDefault from './Loader'
import NotFoundDefault from './NotFound'
import createWindowHistory from '../utils/createWindowHistory'
import sleep from '../utils/sleep'

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

export interface ISwitchProps {
  items: ISwitchItem[]
  history?: BrowserHistory | MemoryHistory | HashHistory
  Forbidden?: React.ComponentType<any>
  NotFound?: React.ComponentType<any>
  Loader?: React.ComponentType<any>
  Error?: React.ComponentType<any>
  onLoadStart?: () => void
  onLoadEnd?: (isOk?: boolean) => void
}

const canActivate = async (item: ISwitchItem) => {
  const { guard = () => true } = item
  const isAvailable = guard()
  if (isAvailable instanceof Promise) {
    return await isAvailable
  } else {
    return isAvailable
  }
}

const DEFAULT_HISTORY = createWindowHistory()

const Fragment = () => <></>

export const Switch = ({
  Loader = LoaderDefault,
  Forbidden = ForbiddenDefault,
  NotFound = NotFoundDefault,
  Error = ErrorDefault,
  history = DEFAULT_HISTORY,
  items,
  onLoadStart,
  onLoadEnd,
}: ISwitchProps) => {
  const unloadRef = useRef<(() => Promise<void>) | null>(null)

  const [location, setLocation] = useState<Location>({
    ...history.location
  })

  useEffect(() => {
    const handleLocation = (update: Update) => {
      if (update.location.pathname !== location.pathname) {
        const newLocation = { ...update.location }
        setLocation(newLocation)
      }
    }
    return history.listen(handleLocation)
  }, [history, location])

  const handleState = useMemo(
    () => async (url: string) => {
      unloadRef.current && (await unloadRef.current())
      for (const item of items) {
        const { element = Fragment, redirect, prefetch, unload, path } = item

        const params: Record<string, unknown> = {}

        const keys: Key[] = []
        const reg = pathToRegexp(path, keys)
        const match = reg.test(url)

        const buildParams = () => {
          const tokens = reg.exec(url)
          tokens &&
            keys.forEach((key, i) => {
              params[key.name] = tokens[i + 1]
            })
        }

        const provideUnloadRef = () => {
          if (unload) {
            unloadRef.current = async () => {
              await Promise.resolve(unload(params))
              unloadRef.current = null
            }
          }
        }

        if (match) {
          if (await canActivate(item)) {
            buildParams()
            prefetch && Object.assign(params, await prefetch(params))
            provideUnloadRef()
            if (typeof redirect === 'string') {
              setLocation((location) => ({
                ...location,
                pathname: redirect
              }))
              return {
                element: Fragment
              }
            }
            if (typeof redirect === 'function') {
              const result = redirect(params)
              if (result !== null) {
                setLocation((location) => ({
                  ...location,
                  pathname: result
                }))
                return {
                  element: Fragment
                }
              }
            }
            return {
              element,
              params
            }
          }
          return {
            element: Forbidden
          }
        }
      }
      return {
        element: NotFound
      }
    },
    [location]
  )

  return (
    <HistoryContext history={history}>
      <FetchView<string>
        state={handleState}
        Loader={Loader}
        Error={Error}
        payload={location.pathname}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
      >
        {async (data: any) => {
          const { element: Element = Fragment, params } = data
          /* delay to prevent sync execution for appear animation */
          await sleep(0)
          return <Element {...params} />
        }}
      </FetchView>
    </HistoryContext>
  )
}

export default Switch
