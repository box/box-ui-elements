import * as React from 'react';
import { RouterContext } from './RouterContext';

/**
 * @typedef {Object} Props
 * @property {import('./flowTypes').RouterHistory} history
 * @property {React.ReactNode} children
 * @property {Object} [location]
 * @property {Object} [match]
 */

/** @type {React.FC<Props>} */
const Router = ({ history, children, location: locationProp, match: matchProp }) => {
    const [location, setLocation] = React.useState(locationProp || history.location);

    React.useEffect(() => {
        if (locationProp) {
            setLocation(locationProp);
        }
    }, [locationProp]);

    React.useEffect(() => {
        // Default listen function from RouterContext if history.listen is undefined
        const listen = history.listen || (() => () => {});

        const unlisten = listen(update => {
            // Handle both History v4 and v5 APIs
            const nextLocation = 'location' in update ? update.location : update;
            setLocation(nextLocation);
        });
        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, [history]);

    const match = matchProp || {
        params: {},
        isExact: true,
        path: location.pathname,
        url: location.pathname,
    };

    return <RouterContext.Provider value={{ history, location, match }}>{children}</RouterContext.Provider>;
};

export default Router;
