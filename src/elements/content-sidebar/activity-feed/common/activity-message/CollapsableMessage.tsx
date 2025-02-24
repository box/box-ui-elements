import * as React from 'react';
import classNames from 'classnames';
import CollapsableMessageToggle from './CollapsableMessageToggle';
import './ActivityMessage.scss';

export interface CollapsableMessageProps {
    children: React.ReactNode;
}

export default function CollapsableMessage({ children }: CollapsableMessageProps): React.ReactElement {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [shouldCollapse, setShouldCollapse] = React.useState(false);
    const messageContainer = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (messageContainer.current) {
            const { clientHeight, scrollHeight } = messageContainer.current;
            setShouldCollapse(clientHeight !== scrollHeight);
        }
    }, []);

    return (
        <>
            <div
                className={classNames({
                    'bcs-ActivityMessage-collapsed': isCollapsed,
                })}
                ref={messageContainer}
            >
                {children}
            </div>

            {shouldCollapse && (
                <CollapsableMessageToggle
                    isMore={isCollapsed}
                    onClick={() => setIsCollapsed(prevState => !prevState)}
                />
            )}
        </>
    );
}
