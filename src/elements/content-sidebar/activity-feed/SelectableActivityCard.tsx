import * as React from 'react';
import classNames from 'classnames';
import ActivityCard, { Props as ActivityCardProps } from './ActivityCard';
// @ts-ignore flow import
import { decode } from '../../../utils/keys';
import './SelectableActivityCard.scss';

export type Props = {
    isDisabled?: boolean;
    onSelect: () => void;
} & ActivityCardProps;

const SelectableActivityCard = ({ children, className, isDisabled = false, onSelect, ...rest }: Props): JSX.Element => {
    const ref = React.useRef<HTMLDivElement | null>(null);

    const isUserLink = (event: React.SyntheticEvent<HTMLDivElement>): boolean => {
        return event.target instanceof HTMLElement && event.target.classList.contains('bcs-UserLink');
    };

    const handleClick = (event: React.SyntheticEvent<HTMLDivElement>): void => {
        if (isDisabled || isUserLink(event)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS

        onSelect();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (isDisabled || isUserLink(event)) {
            return;
        }

        const key = decode(event);

        if (key === 'Space' || key === 'Enter') {
            onSelect();
        }
    };

    return (
        <ActivityCard
            ref={ref}
            aria-disabled={isDisabled}
            className={classNames('bcs-SelectableActivityCard', className)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            {...rest}
        >
            {children}
        </ActivityCard>
    );
};

export default SelectableActivityCard;
