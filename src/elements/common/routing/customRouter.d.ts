import type { ReactNode } from 'react';
import type { History } from './flowTypes';

export interface CustomRouterProps {
    children: ReactNode;
    history?: History;
    initialEntries?: string[];
}

declare const CustomRouter: React.FC<CustomRouterProps>;

export default CustomRouter;
