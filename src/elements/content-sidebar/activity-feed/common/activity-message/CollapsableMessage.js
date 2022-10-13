// @flow
import * as React from 'react';
import classNames from 'classnames';
import ToggleMoreLessButton from './ToggleMoreLessButton';
import './ActivityMessage.scss';

type Props = {
    children: React.Node,
};

export default function CollapsableMessage({ children }: Props) {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [shouldCollapse, setShouldCollapse] = React.useState(false);
    const messageContainer = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (messageContainer.current) {
            const { clientHeight, scrollHeight } = messageContainer.current;
            setShouldCollapse(clientHeight !== scrollHeight || clientHeight > 140);
        }
    }, []);

    return (
        <>
            <div
                className={classNames({
                    'bcs-ActivityMessage-truncated': isCollapsed,
                })}
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
