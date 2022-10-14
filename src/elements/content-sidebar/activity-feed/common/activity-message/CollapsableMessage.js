// @flow
import * as React from 'react';
import classNames from 'classnames';
import ToggleMoreLessButton from './ToggleMoreLessButton';
import './ActivityMessage.scss';

type Props = {
    children: React.Node,
};

// this is for backward support for IE11
const MAX_MESSAGE_HEIGHT = 140;

export default function CollapsableMessage({ children }: Props) {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [shouldCollapse, setShouldCollapse] = React.useState(false);
    const messageContainer = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (messageContainer.current) {
            const { clientHeight, scrollHeight } = messageContainer.current;
            setShouldCollapse(clientHeight !== scrollHeight || clientHeight > MAX_MESSAGE_HEIGHT);
        }
    }, []);

    return (
        <>
            <div
                className={classNames({
                    'bcs-ActivityMessage-collapsed': isCollapsed,
                })}
                style={{ maxHeight: isCollapsed ? MAX_MESSAGE_HEIGHT : 'none' }}
                ref={messageContainer}
            >
                {children}
            </div>

            {shouldCollapse && (
                <ToggleMoreLessButton isMore={isCollapsed} onClick={() => setIsCollapsed(prevState => !prevState)} />
            )}
        </>
    );
}
