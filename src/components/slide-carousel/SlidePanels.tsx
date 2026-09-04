import * as React from 'react';

export interface SlidePanelsProps {
    /** Slides rendered within the panels */
    children?: React.ReactNode;
    /** Pure function that returns a panel ID unique to the given index */
    getPanelIdFromValue: (index: number) => string;
    /** Handler invoked with the index of the selected slide */
    onSelection?: (index: number) => void;
    /** Index of the selected slide */
    selectedIndex: number;
    /** Inline styles applied to the panels container */
    style?: React.CSSProperties;
}

class SlidePanels extends React.Component<SlidePanelsProps> {
    static displayName = 'SlidePanels';

    containerEl: HTMLDivElement | null = null;

    focusOnContainerElement = () => {
        if (this.containerEl) {
            this.containerEl.focus();
        }
    };

    handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
                tabIndex={'0' as unknown as number}
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

export default SlidePanels;
