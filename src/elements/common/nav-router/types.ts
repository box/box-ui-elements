import { History } from 'history';
import { FeatureConfig } from '../feature-checking';

export type WithNavRouterProps = {
    features?: FeatureConfig;
    history?: History;
    initialEntries?: History.LocationDescriptor[];
};
