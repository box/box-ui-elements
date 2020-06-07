import { History } from 'history';

export type WithNavRouterProps = {
    history?: History;
    initialEntries?: History.LocationDescriptor[];
};
