// @flow
import range from 'lodash/range';
import * as React from 'react';

import SlideButton from './SlideButton';

type Props = {
    /** Pure function that returns a button id unique to the given value  */
    getButtonIdFromValue: Function,
    /** Pure function that returns a panel id unique to the given value  */
    getPanelIdFromValue: Function,
    /** Gets called when a slide is selected. Called with the appropriate slide index  */
    numOptions: number,
    /** The number of slides. Each is associated to an index, starting from 0 */
    onSelection: Function,
    selectedIndex: number,
};

class SlideNavigator extends React.Component<Props> {
    buttonElements = [];

    focusOnButtonElement = (index: number) => {
        if (index + 1 > this.buttonElements.length || index < 0) {
            return;
        }

        this.buttonElements[index].focus();
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        const { numOptions, selectedIndex } = this.props;

        let nextIndex = null;
        switch (event.key) {
            case 'ArrowRight':
                nextIndex = (selectedIndex + 1) % numOptions;
                break;

            case 'ArrowLeft':
                nextIndex = (selectedIndex - 1 + numOptions) % numOptions;
                break;

            default:
                return;
        }

        this.handleSelection(nextIndex);
        event.preventDefault();
        event.stopPropagation();
    };

    handleSelection = (index: number) => {
        this.focusOnButtonElement(index);
        this.props.onSelection(index);
    };

    render() {
        const { getButtonIdFromValue, getPanelIdFromValue, numOptions, onSelection, selectedIndex } = this.props;

        return (
            <nav
                className="slide-navigator"
                /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
                onKeyDown={this.handleKeyDown}
                role="tablist"
            >
                {range(numOptions).map((child, i) => (
                    <SlideButton
                        key={i}
                        aria-controls={getPanelIdFromValue(i)}
                        aria-label={`slide${i}`}
                        buttonRef={buttonEl => {
                            this.buttonElements[i] = buttonEl;
                        }}
                        id={getButtonIdFromValue(i)}
                        isSelected={i === selectedIndex}
                        onClick={() => onSelection(i)}
                        tabIndex={i === selectedIndex ? '0' : '-1'}
                    />
                ))}
            </nav>
        );
    }
}

export default SlideNavigator;
