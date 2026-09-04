import * as React from 'react';

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Content displayed in the tab panel */
    children?: React.ReactNode;
    /** Custom class name applied to the tab button */
    className?: string;
    /** Custom component used to render a linked tab */
    component?: React.ElementType;
    /** URL used to render the tab as a link */
    href?: string;
    /** Ref property used by a custom link component */
    refProp?: string;
    /** Label displayed in the tab */
    title: string;
}

const Tab: (props: TabProps) => React.ReactElement = () => <i />;

export default Tab;
