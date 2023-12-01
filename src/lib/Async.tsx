import * as React from 'react'

import { useEffect, useMemo, useState } from 'react'

import queued from '../utils/queued'

export interface IAsyncProps<T extends any = object> {
  children: (p: T) => Result | Promise<Result>
  Loader?: React.ComponentType
  Error?: React.ComponentType
  onLoadStart?: () => void
  onLoadEnd?: (isOk: boolean) => void
  payload?: T
  deps?: any[]
}

type Result = React.ReactNode

export const Async = <T extends any = object>({
  children,
  Loader = () => null,
  Error = () => null,
  onLoadStart,
  onLoadEnd,
  payload,
  deps = []
}: IAsyncProps<T>) => {
  const [child, setChild] = useState<Result>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const execute = useMemo(
    () =>
      queued(async (payload) => {
        let isOk = true
        setLoading(true)
        setError(false)
        onLoadStart && onLoadStart()
        try {
          const result = children(payload!)
          if (result instanceof Promise) {
            return (await result) || null
          } else {
            return result || null
          }
        } catch (e) {
          isOk = false
        } finally {
          setLoading(false)
          setError(!isOk)
          onLoadEnd && onLoadEnd(isOk)
        }
        return null
      }),
    []
  )

  useEffect(() => {
    const process = async () => {
      const result = await execute(payload)
      setChild(result)
    }

    process()
  }, [payload, ...deps])

  if (loading) {
    return <Loader />
  } else if (error) {
    return <Error />
  } else {
    return <>{child}</>
  }
}

export default Async
