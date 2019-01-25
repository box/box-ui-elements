// @flow
import * as React from 'react';

type Props = {
    getPanelIdFromValue: Function,
    children?: React.Node,
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
            <div
                className="slide-panels"
                onKeyDown={this.handleKeyDown}
                ref={containerEl => {
                    this.containerEl = containerEl;
                }}
                tabIndex="0"
                style={style}
            >
                {React.Children.map(children, (child, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                        <div
                            aria-hidden={!isSelected}
                            className="slide-panel"
                            id={getPanelIdFromValue(i)}
                            key={i}
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
