import * as React from 'react'

import { BrowserHistory, HashHistory, MemoryHistory, createMemoryHistory } from 'history';
import { createContext, useContext } from 'react';

const Context = createContext<BrowserHistory | MemoryHistory | HashHistory>(createMemoryHistory());

interface IHistoryContextProps {
    children: React.ReactNode;
    history: BrowserHistory | MemoryHistory | HashHistory;
}

export const HistoryContext = ({
    children,
    history,
}: IHistoryContextProps) => (
    <Context.Provider value={history}>
        {children}
    </Context.Provider>
);

export const useHistoryContext = () => useContext(Context);

export default HistoryContext;
