// @flow
import * as React from 'react';
import classNames from 'classnames';
import ToggleMoreLessButton from './ToggleMoreLessButton';
import './ActivityMessage.scss';

type Props = {
    children: React.Node,
};

export default function TruncatableMessage({ children }: Props) {
    const [isTruncated, setTruncated] = React.useState(true);
    const [shouldTruncate, setShouldTrucate] = React.useState(false);
    const messageContainer = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (messageContainer.current) {
            const { clientHeight, scrollHeight } = messageContainer.current;
            setShouldTrucate(clientHeight !== scrollHeight || clientHeight > 140);
        }
    }, []);

    return (
        <>
            <div
                className={classNames({
                    'bcs-ActivityMessage-truncated': isTruncated,
                })}
                ref={messageContainer}
            >
                {children}
            </div>

            {shouldTruncate ? (
                <ToggleMoreLessButton isMore={isTruncated} onClick={() => setTruncated(prevState => !prevState)} />
            ) : null}
        </>
    );
}
