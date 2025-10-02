import * as React from 'react';
export interface PortalProps {
    className?: string;
    container: HTMLElement | null | undefined;
    style?: {
        [arg: string]: string | number;
    };
}
declare class Portal extends React.PureComponent<PortalProps> {
    static defaultProps: {
        container: HTMLElement;
    };
    constructor(props: PortalProps);
    componentWillUnmount(): void;
    layer: HTMLDivElement | null | undefined;
    container: HTMLElement | null | undefined;
    render(): null | React.ReactPortal;
}
export default Portal;
