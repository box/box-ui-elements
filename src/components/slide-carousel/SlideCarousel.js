// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import SlideCarouselPrimitive from './SlideCarouselPrimitive';

import './SlideCarousel.scss';

type Props = {
    children?: React.Node,
    className?: string,
    /** Used as the value for the content area's style height property */
    contentHeight?: string,
    /** If provided, turns this into a controlled component where the parent chooses which slide index to render */
    currentIndex?: number,
    /** Index of initial slide to render. Will be overriden by currentIndex if currentIndex is provided */
    initialIndex: number,
    /** Callback for when the slide changes */
    onSlideChange?: (newIndex: number) => void,
    title?: string,
};

type State = {
    selectedIndex: number,
};

class SlideCarousel extends React.Component<Props, State> {
    static defaultProps = {
        className: '',
        initialIndex: 0,
    };

    constructor(props: Props) {
        super(props);

        this.id = uniqueId('slidecarousel');

        this.state = {
            selectedIndex: props.initialIndex || 0,
        };
    }

    isControlled() {
        const { currentIndex } = this.props;
        return currentIndex !== undefined;
    }

    /*
     * If the selected index in the state has somehow gotten set to an
     * out of bounds value (either because we were passed a bad value,
     * or the number of children has reduced), compute a new selected
     * index which is a floored value between 0 <= index < num children
     */
    getBoundedSelectedIndex() {
        const { children, currentIndex } = this.props;
        const { selectedIndex } = this.state;

        const indexToCheck = this.isControlled() ? currentIndex : selectedIndex;

        const lastChildIndex = Math.max(React.Children.count(children) - 1, 0);
        const boundedSelectedIndex = Math.max(indexToCheck || 0, 0);

        return boundedSelectedIndex > lastChildIndex ? lastChildIndex : Math.floor(boundedSelectedIndex);
    }

    setSelectedIndex = (index: number) => {
        const { onSlideChange } = this.props;
        if (!this.isControlled()) {
            // Only update local state if we're using this as an uncontrolled component
            this.setState({ selectedIndex: index });
        }
        if (onSlideChange) {
            onSlideChange(index);
        }
    };

    id: string;

    render() {
        const { children, className, contentHeight, title } = this.props;
        const selectedIndex = this.getBoundedSelectedIndex();

        return (
            <SlideCarouselPrimitive
                className={className}
                contentHeight={contentHeight}
                idPrefix={this.id}
                onSelection={this.setSelectedIndex}
                selectedIndex={selectedIndex}
                title={title}
            >
                {children}
            </SlideCarouselPrimitive>
        );
    }
}

export default SlideCarousel;
