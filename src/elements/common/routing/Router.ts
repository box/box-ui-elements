import type { MouseEvent, ReactNode } from 'react';
import type { Location } from 'history';
import type { History } from './flowTypes';

export interface RouterProps {
    children: ReactNode;
    location: Location;
    history: History;
}

export interface LinkProps {
    children: ReactNode;
    className?: string;
    to: string;
    onClick?: (event: MouseEvent) => void;
    href?: string;
}

export { default as Link } from './customRouter';
export { default as Router } from './customRouter';
export { default } from './customRouter';
