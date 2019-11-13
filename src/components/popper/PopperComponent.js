// @flow
import * as React from 'react';
import { Manager, Reference, Popper, type Modifiers } from 'react-popper';
import { PLACEMENT_AUTO } from './constants';

type Props = {
    children: React.ReactNode,
    isOpen?: boolean,
    modifiers?: Modifiers,
    placement?: string,
};

const PopperComponent = (props: Props) => {
    const { children, isOpen, modifiers, placement: popperPlacement = PLACEMENT_AUTO } = props;
    const elements = React.Children.toArray(children);

    if (elements.length !== 2) {
        throw new Error('PopperComponent must have exactly two children: A reference component and the Popper content');
    }

    const reference = elements[0];
    const popperContent = elements[1];

    return (
        <Manager>
            <Reference>{({ ref }) => React.cloneElement(reference, { ref })}</Reference>
            {isOpen && (
                <Popper placement={popperPlacement} modifiers={modifiers}>
                    {({ ref, style, placement, scheduleUpdate }) => {
                        return React.cloneElement(popperContent, {
                            ref,
                            style,
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
