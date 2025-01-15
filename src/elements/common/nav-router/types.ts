import { History, Location } from 'history';

export interface WithNavRouterProps {
    history: History;
    location: Location;
    match: {
        params: Record<string, string>;
        isExact: boolean;
        path: string;
        url: string;
    };
}
