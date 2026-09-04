// @flow
import classNames from 'classnames';
import * as React from 'react';
import noop from 'lodash/noop';

import CarouselHeader from './CarouselHeader';
import SlideNavigator from './SlideNavigator';
import SlidePanels from './SlidePanels';

type Props = {
    children?: React.Node,
    className?: string,
    /** The constant value to use for the content area's style height property */
    contentHeight?: string,
    idPrefix?: string,
    onSelection: Function,
    selectedIndex: number,
    title?: string,
};

const SlideCarouselPrimitive = ({
    children,
    className = '',
    contentHeight,
    idPrefix = '',
    onSelection = noop,
    selectedIndex,
    title,
}: Props) => {
    const buttonIdGenerator = val => `${idPrefix && `${idPrefix}-`}selector-${val}`;
    const panelIdGenerator = val => `${idPrefix && `${idPrefix}-`}slide-panel-${val}`;
    return (
        <div className={classNames('slide-carousel', className)}>
            {title && <CarouselHeader title={title} />}
            <SlidePanels
                getButtonIdFromValue={buttonIdGenerator}
                getPanelIdFromValue={panelIdGenerator}
                onSelection={onSelection}
                selectedIndex={selectedIndex}
                style={{ height: contentHeight }}
            >
                {children}
            </SlidePanels>
            <SlideNavigator
                getButtonIdFromValue={buttonIdGenerator}
                getPanelIdFromValue={panelIdGenerator}
                // $FlowFixMe
                numOptions={(children && children.length) || 0}
                onSelection={onSelection}
                selectedIndex={selectedIndex}
            />
        </div>
    );
};

SlideCarouselPrimitive.displayName = 'SlideCarouselPrimitive';

export default SlideCarouselPrimitive;
