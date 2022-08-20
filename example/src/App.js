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
