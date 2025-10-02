// @flow
import * as React from 'react';

type Props = {
    children?: React.Node,
    getPanelIdFromValue: Function,
    onSelection?: Function,
    selectedIndex: number,
    style?: Object,
};

class SlidePanels extends React.Component<Props> {
    containerEl: ?HTMLDivElement;

    focusOnContainerElement = () => {
        if (this.containerEl) {
            this.containerEl.focus();
        }
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLDivElement>) => {
        const { children, selectedIndex } = this.props;

        const numOptions = React.Children.count(children);

        let nextIndex = null;
        switch (event.key) {
            case 'ArrowRight':
                nextIndex = (selectedIndex + 1) % numOptions;
                break;

            case 'ArrowLeft':
                nextIndex = (selectedIndex - 1 + numOptions) % numOptions;
                break;

            default:
                break;
        }

        if (nextIndex !== null) {
            this.handleSelection(nextIndex);
            event.preventDefault();
            event.stopPropagation();
        }
    };

    handleSelection = (index: number) => {
        const { onSelection } = this.props;
        this.focusOnContainerElement();
        if (onSelection) {
            onSelection(index);
        }
    };

    render() {
        const { getPanelIdFromValue, children, selectedIndex, style } = this.props;

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                ref={containerEl => {
                    this.containerEl = containerEl;
                }}
                className="slide-panels"
                onKeyDown={this.handleKeyDown}
                style={style}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex="0"
            >
                {React.Children.map(children, (child, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                        <div
                            key={i}
                            aria-hidden={!isSelected}
                            className="slide-panel"
                            id={getPanelIdFromValue(i)}
                            role="tabpanel"
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        );
    }
}

SlidePanels.displayName = 'SlidePanels';

export default SlidePanels;
