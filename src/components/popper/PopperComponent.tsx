import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import type { Modifiers, Placement } from 'popper.js';
import { PLACEMENT_AUTO } from './constants';

export interface PopperComponentProps {
    /** Reference element followed by the popper content element */
    children: React.ReactNode;
    /** Whether to render the popper content */
    isOpen?: boolean;
    /** Whether to apply the positioning styles calculated by Popper */
    isPositionDynamic?: boolean;
    /** Popper.js modifiers that customize positioning behavior */
    modifiers?: Modifiers;
    /** Preferred placement of the popper content */
    placement?: Placement;
}

const PopperComponent = ({
    children,
    isPositionDynamic = true,
    isOpen,
    modifiers,
    placement: popperPlacement = PLACEMENT_AUTO,
}: PopperComponentProps) => {
    const elements = React.Children.toArray(children);

    if (elements.length !== 2) {
        throw new Error('PopperComponent must have exactly two children: A reference component and the Popper content');
    }

    const [reference, popperContent] = elements as React.ReactElement[];

    return (
        <Manager>
            <Reference>{({ ref }) => React.cloneElement(reference, { ref })}</Reference>
            {isOpen && (
                <Popper placement={popperPlacement} modifiers={modifiers}>
                    {({ ref, style, placement, scheduleUpdate }) => {
                        const { style: contentStyles } = popperContent.props;
                        return React.cloneElement(popperContent, {
                            ref,
                            style: { ...contentStyles, ...(isPositionDynamic && style) },
                            placement,
                            scheduleUpdate,
                        });
                    }}
                </Popper>
            )}
        </Manager>
    );
};

export default PopperComponent;
