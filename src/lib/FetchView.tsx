import React from 'react'

import LoaderPlaceholder from './Loader'
import ErrorPlaceholder from './Error'

import Async, { IAsyncProps } from './Async'

type FetchState<T extends any = object> =
  | ((payload: T) => Promise<any>)
  | ((payload: T) => any)

export interface IFetchViewProps<P extends any = object>
  extends Omit<
    IAsyncProps<P>,
    keyof {
      children: never
    }
  > {
  state: FetchState<P> | FetchState<P>[]
  children: (...data: any[]) => React.ReactNode
}

export const FetchView = <P extends any = object>({
  Loader = LoaderPlaceholder,
  Error = ErrorPlaceholder,
  onLoadEnd,
  onLoadStart,
  children,
  state,
  payload,
  ...otherProps
}: IFetchViewProps<P>) => {
  const handleData = async (payload: P): Promise<any[]> => {
    if (Array.isArray(state)) {
      return await Promise.all(state.map((item) => item(payload)))
    } else {
      return [await state(payload)]
    }
  }

  return (
    <Async<P>
      {...otherProps}
      Loader={Loader}
      Error={Error}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      payload={payload}
    >
      {async (payload: P) => {
        const data = await handleData(payload)
        return children(...data)
      }}
    </Async>
  )
}

export default FetchView
