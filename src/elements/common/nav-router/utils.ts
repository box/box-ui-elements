import { History } from 'history';
import { WithNavRouterProps } from './types';

export interface MatchResult {
    isExact: boolean;
    params: Record<string, string>;
}

export function matchPath(pathname: string, path: string | string[]): MatchResult {
    const paths = Array.isArray(path) ? path : [path];
    const params: Record<string, string> = {};

    for (const currentPath of paths) {
        const pathSegments = currentPath.split('/').filter(Boolean);
        const pathnameSegments = pathname.split('/').filter(Boolean);

        if (pathSegments.length <= pathnameSegments.length) {
            let isMatch = true;
            const segmentLength = pathSegments.length;

            for (let i = 0; i < segmentLength; i += 1) {
                const pathSegment = pathSegments[i];
                const pathnameSegment = pathnameSegments[i];

                if (pathSegment.startsWith(':')) {
                    // This is a parameter
                    const paramName = pathSegment.slice(1);
                    params[paramName] = pathnameSegment;
                } else if (pathSegment === '*') {
                    // Wildcard matches anything
                    params[i.toString()] = pathnameSegments.slice(i).join('/');
                    break;
                } else if (pathSegment !== pathnameSegment) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                return {
                    isExact: pathSegments.length === pathnameSegments.length,
                    params,
                };
            }
        }
    }

    return { isExact: false, params: {} };
}

export function useMatch(
    props: Partial<WithNavRouterProps> & { history: History },
    path: string | string[],
): MatchResult {
    const location = props.location || props.history.location;
    return matchPath(location.pathname, path);
}
