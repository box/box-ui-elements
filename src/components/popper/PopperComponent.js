// @flow
import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import type { Modifiers, Placement } from 'popper.js';
import { PLACEMENT_AUTO } from './constants';

type Props = {
    children: React.Node,
    isOpen?: boolean,
    modifiers?: Modifiers,
    placement: Placement,
    positionFixed?: boolean,
};

const PopperComponent = (props: Props) => {
    const { children, isOpen, modifiers, placement: popperPlacement, positionFixed } = props;
    const elements = React.Children.toArray(children);

    if (elements.length !== 2) {
        throw new Error('PopperComponent must have exactly two children: A reference component and the Popper content');
    }

    const [reference, popperContent] = elements;

    return (
        <Manager>
            <Reference>{({ ref }) => React.cloneElement(reference, { ref })}</Reference>
            {isOpen && (
                <Popper placement={popperPlacement} modifiers={modifiers} positionFixed={positionFixed}>
                    {({ ref, style, placement, scheduleUpdate }) => {
                        const { style: contentStyles } = popperContent.props;
                        return React.cloneElement(popperContent, {
                            ref,
                            style: { ...style, ...contentStyles },
                            placement,
                            scheduleUpdate,
                        });
                    }}
                </Popper>
            )}
        </Manager>
    );
};

PopperComponent.defaultProps = {
    placement: PLACEMENT_AUTO,
};

export default PopperComponent;
