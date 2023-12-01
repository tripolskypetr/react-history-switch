import * as React from 'react'

import { useHistoryContext } from '../context/HistoryContext'

interface ILinkProps extends Omit<React.HTMLProps<HTMLAnchorElement>, 'href'> {
  to: string
}

export const Link = ({ to, ...otherProps }: ILinkProps) => {
  const history = useHistoryContext()
  return <a {...otherProps} href='#' onClick={() => history.push(to)} />
}

export default Link
