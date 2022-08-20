# react-history-switch

> Self-hosted context-free Switch component for [History.js](https://www.npmjs.com/package/history) library

## Installation

```bash
npm install --save react-history-switch
```

## Purpose of development

The library was created to transfer navigation responsibility from a view into Mobx state container ([MVC](https://en.wikipedia.org/wiki/Model-view-controller)). Also can be used separately as a self-hosted router

```tsx
import { createObservableHistory } from "mobx-observable-history"

...

const routerService = createObservableHistory();

...

<Switch history={routerService} ... />
```

## Minimal example

```tsx
import React from 'react';

import { Switch } from 'react-history-switch';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const Link = ({
    children,
    href,
}) => (
    <p
        style={{color: 'blue', textDecoration: 'underline'}}
        onClick={() => history.push(href)}
    >
        {children}
    </p>
);

const HomePage = () => (
    <>
        <p>Home page</p>
        <Link href='/next/some-value'>
            Next page
        </Link>
    </>
);

const NextPage = ({
    param,
}) => (
    <>
        <p>The next page</p>
        <p>{`Param: ${param}`}</p>
        <Link href="/home">
            Go back
        </Link>
    </>
);

const NotFound = () => (
    <p>Not found</p>
);

/**
 * @type import('react-history-switch').ISwitchItem[]
 */
const items = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        element: HomePage,
    },
    {
        path: '/next/:param',
        element: NextPage,
    },
];

export const App = () => {
    return (
        <Switch
            items={items}
            history={history}
            NotFound={NotFound}
        />
    );
};

export default App;
```

## Mobx app example

If you are looking for Mobx MVC example app you should check [this](https://github.com/react-declarative/list-app-mobx) repository

## License

MIT © [tripolskypetr](https://github.com/tripolskypetr)
