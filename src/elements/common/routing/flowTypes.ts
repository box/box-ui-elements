import type { History as HistoryType, Location } from 'history';
import type { MouseEvent, ReactNode } from 'react';

export type Match = {
    params: { [key: string]: string };
    path: string;
    url: string;
    isExact: boolean;
};

export type History = HistoryType;

export type ContextRouter = {
    history: History;
    location: Location;
    match: Match;
};

export type LinkProps = {
    children: ReactNode;
    className?: string;
    to: string;
    onClick?: (event: MouseEvent) => void;
    href?: string;
};
