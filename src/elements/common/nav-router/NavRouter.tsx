import * as React from 'react';
import { createBrowserHistory, createMemoryHistory, History, Location } from 'history';

export interface NavRouterContextValue {
    history: History;
    location: Location;
    match: {
        params: Record<string, string>;
        isExact: boolean;
        path: string;
        url: string;
    };
}

export interface Props {
    children: React.ReactNode;
    history?: History;
    initialEntries?: string[];
}

export const NavRouterContext = React.createContext<NavRouterContextValue | null>(null);

export const useNavRouter = () => {
    const context = React.useContext(NavRouterContext);
    if (!context) {
        throw new Error('useNavRouter must be used within a NavRouter');
    }
    return context;
};

const NavRouter = ({ children, history: providedHistory, initialEntries }: Props) => {
    const [history] = React.useState<History>(
        () => providedHistory || (initialEntries ? createMemoryHistory({ initialEntries }) : createBrowserHistory()),
    );
    const [location, setLocation] = React.useState<Location>(history.location);

    React.useEffect(() => {
        const unlisten = history.listen(update => {
            setLocation(update);
        });
        return unlisten;
    }, [history]);

    const match = React.useMemo(() => {
        const path = location.pathname;
        return {
            path,
            url: path,
            isExact: path === location.pathname,
            params: {},
        };
    }, [location]);

    const value = React.useMemo(
        () => ({
            history,
            location,
            match,
        }),
        [history, location, match],
    );

    return <NavRouterContext.Provider value={value}>{children}</NavRouterContext.Provider>;
};

export default NavRouter;
