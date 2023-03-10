// @flow
import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import type { Modifiers, Placement } from 'popper.js';
import { PLACEMENT_AUTO } from './constants';

type Props = {
    children: React.Node,
    hasDynamicPosition?: boolean,
    isOpen?: boolean,
    modifiers?: Modifiers,
    placement: Placement,
};

const PopperComponent = (props: Props) => {
    const { children, hasDynamicPosition = true, isOpen, modifiers, placement: popperPlacement } = props;
    const elements = React.Children.toArray(children);

    if (elements.length !== 2) {
        throw new Error('PopperComponent must have exactly two children: A reference component and the Popper content');
    }

    const [reference, popperContent] = elements;

    return (
        <Manager>
            <Reference>{({ ref }) => React.cloneElement(reference, { ref })}</Reference>
            {isOpen && (
                <Popper placement={popperPlacement} modifiers={modifiers}>
                    {({ ref, style, placement, scheduleUpdate }) => {
                        const { style: contentStyles } = popperContent.props;
                        const popperStyle = hasDynamicPosition ? style : {};
                        return React.cloneElement(popperContent, {
                            ref,
                            style: { ...contentStyles, ...popperStyle },
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
