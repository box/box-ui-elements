import * as React from 'react';
import { History } from 'history';
import { type FeatureConfig } from '../feature-checking';
type Props = {
    children: React.ReactNode;
    features?: FeatureConfig;
    history?: History;
    initialEntries?: History.LocationDescriptor[];
};
declare const NavRouter: ({ children, features, history, ...rest }: Props) => React.JSX.Element;
export default NavRouter;
