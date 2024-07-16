// @flow
import * as React from 'react';
// $FlowFixMe
import { Manager, Popper, Reference } from 'react-popper';
// $FlowFixMe
import type { PopperProps } from 'react-popper';

import { PLACEMENT_AUTO } from './constants';

type Props = {
    children: React.Node,
    isOpen?: boolean,
    isPositionDynamic?: boolean,
    modifiers?: PopperProps.modifiers,
    placement: PopperProps.placement,
};

const PopperComponent = (props: Props) => {
    const { children, isPositionDynamic = true, isOpen, modifiers, placement: popperPlacement } = props;
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
                    {({ ref, style, placement, update }) => {
                        const { style: contentStyles } = popperContent.props;
                        return React.cloneElement(popperContent, {
                            ref,
                            style: { ...contentStyles, ...(isPositionDynamic && style) },
                            placement,
                            update,
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
