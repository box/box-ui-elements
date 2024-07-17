import PropTypes from 'prop-types';
import React, { Children, Component } from 'react';

import DatalistItem from '../../src/components/datalist-item';
import SelectorDropdown from '../../src/components/selector-dropdown';
import TextInput from '../../src/components/text-input';

const InputContainer = ({ inputProps, ...rest }) => <TextInput {...inputProps} {...rest} />;
InputContainer.propTypes = { inputProps: PropTypes.object };

class SelectorDropdownContainer extends Component {
    static propTypes = {
        initialItems: PropTypes.array.isRequired,
        placeholder: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            items: props.initialItems,
            showTitle: false,
            remainOpen: false,
        };
    }

    handleShowTitle = () => {
        this.setState({ showTitle: !this.state.showTitle });
    };

    handleRemainOpen = () => {
        this.setState({ remainOpen: !this.state.remainOpen });
    };

    handleUserInput = event => {
        this.filterByItem(event.target.value);
    };

    handleItemSelection = i => {
        this.setState({ filterText: this.state.items[i] });
    };

    filterByItem(item) {
        this.setState({ filterText: item });
        this.filterItems(item);
    }

    filterItems(filterText) {
        const { initialItems } = this.props;
        const filterTextLowerCase = filterText.toLowerCase();
        const items = [];

        initialItems.forEach(item => {
            if (item.toLowerCase().indexOf(filterTextLowerCase) !== -1) {
                items.push(item);
            }
        });

        this.setState({ items });
    }

    render() {
        const { placeholder, title } = this.props;
        const { filterText, items, showTitle, remainOpen } = this.state;
        const dropdownTitle = <div>This is a Title</div>;

        return (
            <div style={{ paddingBottom: '330px' }}>
                <label labelFor="title-check">
                    <input
                        type="checkbox"
                        name="title-check"
                        id="title-check"
                        value={showTitle}
                        onClick={this.handleShowTitle}
                    />
                    <span style={{ paddingLeft: '4px' }}>Add title to overlay</span>
                </label>
                <br />
                <label labelFor="remain-open-check">
                    <input
                        type="checkbox"
                        name="remain-open-check"
                        id="remain-open-check"
                        value={remainOpen}
                        onClick={this.handleRemainOpen}
                    />
                    <span style={{ paddingLeft: '4px' }}>Overlay should remain open</span>
                </label>
                <hr />
                <SelectorDropdown
                    isAlwaysOpen={remainOpen}
                    onSelect={this.handleItemSelection}
                    selector={
                        <InputContainer
                            label={title}
                            name="selectorDropdownInput"
                            onInput={this.handleUserInput}
                            placeholder={placeholder}
                            type="text"
                            value={filterText}
                        />
                    }
                    title={showTitle ? dropdownTitle : undefined}
                >
                    {Children.map(items, item => (
                        <DatalistItem key={item}>{item}</DatalistItem>
                    ))}
                </SelectorDropdown>
            </div>
        );
    }
}

const SelectorDropdownExamples = () => (
    <SelectorDropdownContainer
        initialItems={[
            'Illmatic',
            'The Marshall Mathers LP',
            'All Eyez on Me',
            'Ready To Die',
            'Enter the Wu-Tang',
            'The Eminem Show',
            'The Chronic',
            'Straight Outta Compton',
            'Reasonable Doubt',
            'Super long name that should be truncated, we should see the dots at the very end, adding some more text here, should truncate at any second now, please truncate soon',
        ]}
        placeholder="Select an album"
        title="Album"
    />
);

SelectorDropdownExamples.displayName = 'SelectorDropdownExamples';

export default SelectorDropdownExamples;
